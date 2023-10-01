import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import BrandModel, { IBrand } from "../models/Brand";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_BRAND_SUCCESS,
    MSG_DELETE_BRAND_FAIL,
    MSG_DELETE_BRAND_SUCCESS,
    MSG_UPDATE_BRAND_FAIL,
    MSG_UPDATE_BRAND_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";

export const getAllBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await BrandModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IBrand;
        await BrandModel.create({ name: name });
        return res.json({ message: MSG_CREATE_BRAND_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as IBrand;
        const update = await BrandModel.findByIdAndUpdate(
            id,
            {
                $set: { name: name },
            },
            { new: true, runValidators: true }
        );
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_BRAND_FAIL);

        return res.json({ message: MSG_UPDATE_BRAND_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await BrandModel.findByIdAndDelete(id).exec();

        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_BRAND_FAIL);

        return res.json({ message: MSG_DELETE_BRAND_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
