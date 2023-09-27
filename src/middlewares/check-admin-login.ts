import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import { ILogin } from "../interfaces";
import UserModel, { IUser } from "../models/User";
import HttpStatusCode from "../enums/http-status-code";
import {
    MSG_ERROR_ACCOUNT_NOT_EXISTED,
    MSG_ERROR_FORBIDDEN,
} from "../constants/messages";
import { IRole } from "../models/Role";

interface IUserPopulate extends Omit<IUser, "role"> {
    role: {
        name: string;
    };
}

const checkAdminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as ILogin;
        const user = await UserModel.findOne({ email: email }).populate<IUserPopulate>(
            "role"
        );

        if (!user)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_ERROR_ACCOUNT_NOT_EXISTED
            );

        if (!(user.role.name === "Admin"))
            throw new ResponseError(HttpStatusCode.FORBIDDEN, MSG_ERROR_FORBIDDEN);

        return next();
    } catch (error: ResponseError | any) {
        return next(new ResponseError(500, error.message));
    }
};

export default checkAdminLogin;
