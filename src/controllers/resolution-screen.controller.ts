import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_RESOLUTION_SCREEN_SUCCESS,
    MSG_DELETE_RESOLUTION_SCREEN_FAIL,
    MSG_DELETE_RESOLUTION_SCREEN_SUCCESS,
    MSG_UPDATE_RESOLUTION_SCREEN_FAIL,
    MSG_UPDATE_RESOLUTION_SCREEN_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import ResolutionScreenModel, { IResolutionScreen } from "../models/ResolutionScreen";

export const getAllResolutionScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const list = await ResolutionScreenModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createResolutionScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name } = req.body as IResolutionScreen;
        await ResolutionScreenModel.create({ name: name });
        return res.json({ message: MSG_CREATE_RESOLUTION_SCREEN_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateResolutionScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, name } = req.body as IResolutionScreen;
        const update = await ResolutionScreenModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_UPDATE_RESOLUTION_SCREEN_FAIL
            );

        return res.json({ message: MSG_UPDATE_RESOLUTION_SCREEN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteResolutionScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleteItem = await ResolutionScreenModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_DELETE_RESOLUTION_SCREEN_FAIL
            );

        return res.json({ message: MSG_DELETE_RESOLUTION_SCREEN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
