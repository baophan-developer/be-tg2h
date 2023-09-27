import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import SizeScreenModel, { ISizeScreen } from "../models/SizeScreen";
import {
    MSG_CREATE_SIZE_SCREEN_SUCCESS,
    MSG_DELETE_SIZE_SCREEN_FAIL,
    MSG_DELETE_SIZE_SCREEN_SUCCESS,
    MSG_UPDATE_SIZE_SCREEN_FAIL,
    MSG_UPDATE_SIZE_SCREEN_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";

export const getAllSizeScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sizeScreens = await SizeScreenModel.find({}, "-__v");
        return res.json({ list: sizeScreens });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const createSizeScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { size } = req.body as ISizeScreen;
        await SizeScreenModel.create({ size: size });
        return res.json({ message: MSG_CREATE_SIZE_SCREEN_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateSizeScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, size } = req.body as ISizeScreen;
        const sizeScreen = await SizeScreenModel.findByIdAndUpdate(
            id,
            { $set: { size: size } },
            { new: true, runValidators: true }
        );
        if (!sizeScreen)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_UPDATE_SIZE_SCREEN_FAIL
            );
        return res.json({ message: MSG_UPDATE_SIZE_SCREEN_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const deleteSizeScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const sizeScreen = await SizeScreenModel.findByIdAndDelete(id);
        if (!sizeScreen)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_DELETE_SIZE_SCREEN_FAIL
            );
        return res.json({ message: MSG_DELETE_SIZE_SCREEN_SUCCESS });
    } catch (error: ResponseError | any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};
