import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_OS_SUCCESS,
    MSG_DELETE_OS_FAIL,
    MSG_DELETE_OS_SUCCESS,
    MSG_UPDATE_OS_FAIL,
    MSG_UPDATE_OS_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import OsModel, { IOs } from "../models/Os";

export const getAllOs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await OsModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createOs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IOs;
        await OsModel.create({ name: name });
        return res.json({ message: MSG_CREATE_OS_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateOs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as IOs;
        const update = await OsModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_OS_FAIL);

        return res.json({ message: MSG_UPDATE_OS_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteOs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await OsModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_OS_FAIL);

        return res.json({ message: MSG_DELETE_OS_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
