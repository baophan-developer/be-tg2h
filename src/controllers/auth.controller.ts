import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import RoleModel, { ERole } from "../models/Role";
import UserModel, { IUser } from "../models/User";
import configs from "../configs";
import transporter from "../configs/mail.config";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import { emailRegex } from "../regex";
import { ILogin, IRegisterUser } from "../interfaces";
import HttpStatusCode from "../enums/http-status-code";
import {
    MSG_ERROR_ACCOUNT_NOT_EXISTED,
    MSG_ERROR_EMAIL_INCORRECT,
    MSG_ERROR_PASSWORD_NOT_MATCH,
    MSG_ERROR_ROLE_NOT_EXISTED,
    MSG_ERROR_TOKEN_EXPIRES,
    MSG_ERROR_TOKEN_NOT_EXISTED,
    MSG_LOGIN_SUCCESS,
    MSG_LOGOUT_SUCCESS,
    MSG_REGISTER_SUCCESS,
    MSG_REQUEST_RESET_PASS_SUCCESS,
    MSG_RESET_PASSWORD_SUCCESS,
} from "../constants/messages";
import {
    MAX_LENGTH_PASSWORD_ACCEPT,
    MIN_LENGTH_PASSWORD_ACCEPT,
} from "../constants/user";
import BoughtModel from "../models/Bought";
import AccountModel from "../models/Account";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, phone, gender, birthday } =
            req.body as IRegisterUser;

        // find role user and using for default role
        const role = await RoleModel.findOne({ name: ERole.user });

        if (!role) {
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_ERROR_ROLE_NOT_EXISTED);
        }

        const user = await UserModel.create({
            email: email,
            password: password,
            phone: phone,
            role: role._id,
            name: name,
            gender: gender,
            birthday: birthday,
            avatar: configs.defaultAvatar,
        });

        // create bought and create account
        await BoughtModel.create({
            owner: user._id,
            products: [],
        });

        await AccountModel.create({
            owner: user._id,
            accountBalance: 0,
        });

        return res.json({
            message: MSG_REGISTER_SUCCESS,
        });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

type TCreateToken = {
    accessToken: string;
    refreshToken: string;
};

const createToken = (userId: mongoose.Types.ObjectId, role: string): TCreateToken => {
    const accessToken = jwt.sign({ userId, role }, configs.jwt.accessToken.secret, {
        allowInsecureKeySizes: true,
        expiresIn: configs.jwt.accessToken.expires,
    });
    const refreshToken = jwt.sign({ userId, role }, configs.jwt.refreshToken.secret, {
        allowInsecureKeySizes: true,
        expiresIn: configs.jwt.refreshToken.expires,
    });
    return {
        accessToken,
        refreshToken,
    };
};

interface IUserResponse extends Omit<IUser, "role"> {
    role: {
        name: string;
    };
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, remember } = req.body as ILogin;

        const user = await UserModel.findOne({ email: email })
            .populate<IUserResponse>("role", "-id -__v")
            .exec();

        if (!user)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_ERROR_ACCOUNT_NOT_EXISTED
            );

        const resultComparePassword = await user.comparePassword(password);

        if (!resultComparePassword)
            throw new ResponseError(
                HttpStatusCode.BAD_REQUEST,
                MSG_ERROR_PASSWORD_NOT_MATCH
            );

        const token = createToken(user._id, user.role.name);

        if (remember) {
            await UserModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { refreshToken: token.refreshToken },
                },
                { new: true }
            );
        }

        return res.json({
            accessToken: token.accessToken,
            message: MSG_LOGIN_SUCCESS,
        });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);
        await UserModel.findByIdAndUpdate(
            userId,
            { $set: { refreshToken: null } },
            { new: true }
        );
        return res.json({ message: MSG_LOGOUT_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenBearer = req.headers.authorization || "";
        const accessToken = tokenBearer.slice(7);

        if (!accessToken)
            throw new ResponseError(
                HttpStatusCode.FORBIDDEN,
                MSG_ERROR_TOKEN_NOT_EXISTED
            );

        const { userId, role } = decodeToken(req);
        const user = await UserModel.findById(userId).exec();

        if (user) {
            const refreshToken = user.refreshToken;
            jwt.verify(refreshToken, configs.jwt.refreshToken.secret, async (err) => {
                if (err)
                    return next(
                        new ResponseError(
                            HttpStatusCode.UNAUTHORIZED,
                            MSG_ERROR_TOKEN_EXPIRES
                        )
                    );
            });

            const newToken = createToken(userId, role);

            await UserModel.findByIdAndUpdate(userId, {
                $set: { refreshToken: newToken.refreshToken },
            });

            return res.json({
                accessToken: newToken.accessToken,
            });
        }
        throw new ResponseError(500);
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

interface IForgotPass {
    email: string;
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as IForgotPass;

        if (!String(email).match(emailRegex))
            throw new ResponseError(
                HttpStatusCode.BAD_REQUEST,
                MSG_ERROR_EMAIL_INCORRECT
            );

        const user = await UserModel.findOne({ email: email }).exec();

        if (!user)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_ERROR_ACCOUNT_NOT_EXISTED
            );

        // Create token for reset password
        const tokenResetPassword = jwt.sign(
            { userId: user._id },
            configs.jwt.resetPassword.secret,
            {
                allowInsecureKeySizes: true,
                expiresIn: configs.jwt.resetPassword.expires,
            }
        );

        transporter.sendMail(
            {
                to: email,
                subject: "Mật khẩu mới - thegioi2hand",
                text: `Đường dẫn khôi phục mật khẩu: ${configs.client.user}/reset-password?reset=${tokenResetPassword}`,
            },
            function (err) {
                if (err) return next(new ResponseError(500));
                transporter.close();
                return res.json({ message: MSG_REQUEST_RESET_PASS_SUCCESS });
            }
        );
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

interface IResetPass {
    password: string;
    token: string;
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, token } = req.body as IResetPass;

        jwt.verify(token, configs.jwt.resetPassword.secret, function (err) {
            if (err)
                throw new ResponseError(
                    HttpStatusCode.BAD_REQUEST,
                    MSG_ERROR_TOKEN_EXPIRES
                );
        });

        if (password.length > MAX_LENGTH_PASSWORD_ACCEPT)
            throw new ResponseError(
                HttpStatusCode.BAD_GATEWAY,
                `Mật khẩu không được lớn hơn ${MAX_LENGTH_PASSWORD_ACCEPT} ký tự.`
            );

        if (password.length < MIN_LENGTH_PASSWORD_ACCEPT)
            throw new ResponseError(
                HttpStatusCode.BAD_GATEWAY,
                `Mật khẩu không được ít hơn ${MIN_LENGTH_PASSWORD_ACCEPT} ký tự.`
            );

        const { userId } = jwt.decode(token) as { userId: mongoose.Types.ObjectId };

        const salt = bcrypt.genSaltSync(configs.saltPassword);
        const hashPassword = bcrypt.hashSync(password, salt);

        await UserModel.findByIdAndUpdate(
            userId,
            { $set: { password: hashPassword } },
            { new: true }
        );
        return res.json({ message: MSG_RESET_PASSWORD_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};
