import { NextFunction, Request, Response } from "express";
import ProductModel from "../models/Product";
import DiscountModel, { IDiscount } from "../models/Discount";
import ResponseError from "../utils/error-api";
import {
    MSG_DISCOUNT_CREATE_SUCCESS,
    MSG_DISCOUNT_UPDATE_SUCCESS,
} from "../constants/messages";
import handleError from "../utils/handle-error";

export const getDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const discount = await DiscountModel.findById(id, "-__v");
        return res.json({ item: discount });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, start, end, percent, amount, productId } = req.body as IDiscount;

        const discount = await DiscountModel.create({
            code: code,
            start: start,
            end: end,
            percent: percent,
            amount: amount,
            productId: productId,
            status: true,
        });

        await ProductModel.findByIdAndUpdate(
            productId,
            {
                $set: { discount: discount._id },
            },
            { new: true }
        );

        return res.json({ message: MSG_DISCOUNT_CREATE_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, start, end, percent, amount, status } = req.body as IDiscount;

        await DiscountModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    start: start,
                    end: end,
                    percent: percent,
                    amount: amount,
                    status: status,
                },
            },
            { new: true, runValidators: true }
        );

        return res.json({ message: MSG_DISCOUNT_UPDATE_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
