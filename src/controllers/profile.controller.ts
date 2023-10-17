import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import getPublicIdFile from "../utils/get-public-id";
import UserModel from "../models/User";
import HttpStatusCode from "../enums/http-status-code";
import AddressModel, { IAdress } from "../models/Address";
import ProductModel from "../models/Product";
import {
    MSG_ADD_ADDRESS_SUCCESS,
    MSG_CHOOSE_ADDRESS_IS_MAIN_SUCCESS,
    MSG_ERROR_ACCOUNT_NOT_EXISTED,
    MSG_ERROR_GET_PROFILE_FAILED,
    MSG_REMOVE_ADDRESS_SUCCESS,
    MSG_UPDATE_AVATAR_SUCCESS,
    MSG_UPDATE_PROFILE_SUCCESS,
} from "../constants/messages";
import { uploadHandler } from "../configs/upload.config";
import { Schema } from "mongoose";
import { destroyFile } from "../configs/cloudinary.config";
import configs from "../configs";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);

        await AddressModel.find({});
        await ProductModel.find({});
        const user = await UserModel.findById(
            userId,
            "-__v -password -refreshToken -createdAt -updatedAt -role"
        )
            .populate("address", "-__v")
            .populate("favorites")
            .exec();

        if (!user)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_ERROR_GET_PROFILE_FAILED
            );

        return res.json({
            item: user,
        });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

interface IUpdateProfile {
    email: string;
    name: string;
    birthday: Date;
    phone: string;
    gender: boolean;
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, birthday, phone, gender } = req.body as IUpdateProfile;
        const { userId } = decodeToken(req);

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    email: email,
                    name: name,
                    birthday: birthday,
                    phone: phone,
                    gender: gender,
                },
            },
            { new: true, runValidators: true }
        );

        return res.json({ message: MSG_UPDATE_PROFILE_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);

        const user = await UserModel.findById(userId);

        if (!user) throw new ResponseError(404, MSG_ERROR_ACCOUNT_NOT_EXISTED);

        const avatarOld = user.avatar;

        if (avatarOld && avatarOld !== configs.defaultAvatar) {
            const publicId = getPublicIdFile(avatarOld);

            // delete old file on cloudinary
            await destroyFile(publicId, "avatar");
        }

        const result = await uploadHandler(req, res);

        await UserModel.findByIdAndUpdate(
            userId,
            { $set: { avatar: result.url } },
            { new: true }
        );

        return res.json({ message: MSG_UPDATE_AVATAR_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const addAddressUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { provinceId, districtId, wardId, address, street } = req.body as IAdress;
        const { userId } = decodeToken(req);

        const addressSave = await AddressModel.create({
            provinceId: provinceId,
            districtId: districtId,
            wardId: wardId,
            address: address,
            street: street,
        });

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address: [addressSave._id] } },
            { new: true }
        );

        if (!user) throw new ResponseError(400, "Không thể thêm address");

        if (user.address.length === 1) {
            await AddressModel.findByIdAndUpdate(
                user.address[0],
                {
                    $set: { main: true },
                },
                { new: true }
            );
        }

        return res.json({ message: MSG_ADD_ADDRESS_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

interface IUpdateAddress extends IAdress {
    id: Schema.Types.ObjectId;
}

export const editAddressUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, provinceId, districtId, wardId, address, street } =
            req.body as IUpdateAddress;

        await AddressModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    provinceId: provinceId,
                    districtId: districtId,
                    wardId: wardId,
                    address: address,
                    street: street,
                },
            },
            { new: true, runValidators: true }
        );

        return res.json({ message: MSG_ADD_ADDRESS_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const removeAddressUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params as { id: string };
        const { userId } = decodeToken(req);

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { address: id } },
            { new: true }
        );

        if (!user) throw new ResponseError(400, "Không thể xóa địa chỉ");

        if (user.address.length === 1) {
            await AddressModel.findByIdAndUpdate(
                user.address[0],
                {
                    $set: { main: true },
                },
                { new: true }
            );
        }

        await AddressModel.findByIdAndDelete(id);

        return res.json({ message: MSG_REMOVE_ADDRESS_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const chooseAddressIsMain = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { addressId } = req.body;
        const { userId } = decodeToken(req);

        const user = await UserModel.findById(userId);

        // await AddressModel.updateMany({})
        await AddressModel.updateMany(
            { _id: { $in: user?.address } },
            {
                $set: { main: false },
            }
        );

        // update address is main
        await AddressModel.findByIdAndUpdate(
            addressId,
            {
                $set: {
                    main: true,
                },
            },
            { new: true }
        );

        res.json({ message: MSG_CHOOSE_ADDRESS_IS_MAIN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const addProductToFavorites = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

export const removeProductToFavorites = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};
