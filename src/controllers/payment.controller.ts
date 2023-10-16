import { NextFunction, Request, Response } from "express";
import { IShipping } from "../models/Shipping";
import { uploadHandler } from "../configs/upload.config";
import PaymentModel from "../models/Payment";
import ResponseError from "../utils/error-api";
import { MSG_PAYMENT_CREATE_SUCCESS } from "../constants/messages";

export const getAllPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await PaymentModel.find({}).exec();
        return res.json({ list: payments });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const addPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IShipping;
        const image = await uploadHandler(req, res);

        await PaymentModel.create({
            name: name,
            image: image.url,
            status: true,
        });

        return res.json({ message: MSG_PAYMENT_CREATE_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
