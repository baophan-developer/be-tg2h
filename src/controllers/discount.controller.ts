import { NextFunction, Request, Response } from "express";
import ProductModel from "../models/Product";
import DiscountModel, { IDiscount } from "../models/Discount";
import ResponseError from "../utils/error-api";
import {
    MSG_DISCOUNT_APPLY_SUCCESS,
    MSG_DISCOUNT_CREATE_SUCCESS,
    MSG_DISCOUNT_NOT_FOUND,
    MSG_DISCOUNT_NOT_USE,
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
        const { id, code, start, end, percent, amount, status } = req.body as IDiscount;

        await DiscountModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    code: code,
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

export const removeDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, discountId } = req.body;

        const discount = await DiscountModel.findByIdAndDelete(discountId);

        if (!discount) throw new ResponseError(422, "Không thể xóa mã giảm giá.");

        await ProductModel.findByIdAndUpdate(
            productId,
            {
                $set: { discount: null },
            },
            { new: true }
        );
        return res.json({ message: "Xóa mã giảm giá thành công." });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const useDiscount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body as { code: string };

        const discount = await DiscountModel.findOne({ code: code }).exec();

        const date = new Date();

        if (!discount || code !== discount.code)
            throw new ResponseError(404, MSG_DISCOUNT_NOT_FOUND);

        if (discount.amount === 0) throw new ResponseError(404, MSG_DISCOUNT_NOT_USE);

        if (discount.end.getTime() < date.getTime())
            throw new ResponseError(404, "Lỗi, mã giảm giá không còn hiệu lực");

        if (discount.start.getTime() > date.getTime())
            throw new ResponseError(404, MSG_DISCOUNT_NOT_USE);

        if (!discount.status) throw new ResponseError(404, MSG_DISCOUNT_NOT_USE);

        return res.json({ message: MSG_DISCOUNT_APPLY_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
