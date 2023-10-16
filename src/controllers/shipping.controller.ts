import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import ShippingModel, { IShipping } from "../models/Shipping";
import { MSG_SHIPPING_CREATE_SUCCESS } from "../constants/messages";
import { uploadHandler } from "../configs/upload.config";

export const getAllShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipping = await ShippingModel.find({}).exec();
        return res.json({ list: shipping });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const addShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IShipping;
        const image = await uploadHandler(req, res);

        await ShippingModel.create({
            name: name,
            avatar: image?.url,
            status: true,
        });

        return res.json({ message: MSG_SHIPPING_CREATE_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
