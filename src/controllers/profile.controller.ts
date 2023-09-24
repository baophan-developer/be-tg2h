import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import UserModel from "../models/User";
import HttpStatusCode from "../enums/http-status-code";
import AddressModel, { IAdress } from "../models/Address";
import ProductModel from "../models/Product";
import {
    MSG_ADD_ADDRESS_SUCCESS,
    MSG_ERROR_GET_PROFILE_FAILED,
    MSG_UPDATE_AVATAR_SUCCESS,
    MSG_UPDATE_PROFILE_SUCCESS,
} from "../constants/messages";
import { uploadHandler } from "../configs/upload.config";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);

        await AddressModel.find({});
        await ProductModel.find({});
        const user = await UserModel.findById(
            userId,
            "-_id -__v -password -refreshToken -createdAt -updatedAt -role"
        )
            .populate("address", "-_id -__v")
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
        const result = await uploadHandler(req, res);
        const { userId } = decodeToken(req);

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

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address: [addressSave._id] } },
            { new: true }
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
) => {};

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
