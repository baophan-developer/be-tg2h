import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_CATEGORY_SUCCESS,
    MSG_DELETE_CATEGORY_FAIL,
    MSG_DELETE_CATEGORY_SUCCESS,
    MSG_UPDATE_CATEGORY_FAIL,
    MSG_UPDATE_CATEGORY_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import CategoryModel, { ICategory } from "../models/Category";

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await CategoryModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as ICategory;
        await CategoryModel.create({ name: name });
        return res.json({ message: MSG_CREATE_CATEGORY_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as ICategory;
        const update = await CategoryModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_CATEGORY_FAIL);

        return res.json({ message: MSG_UPDATE_CATEGORY_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await CategoryModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_CATEGORY_FAIL);

        return res.json({ message: MSG_DELETE_CATEGORY_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
