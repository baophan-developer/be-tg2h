import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_TYPE_RAM_SUCCESS,
    MSG_DELETE_TYPE_RAM_FAIL,
    MSG_UPDATE_TYPE_RAM_FAIL,
    MSG_UPDATE_TYPE_RAM_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import TypeRamModel, { ITypeRam } from "../models/TypeRam";

export const getAllTypeRam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await TypeRamModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createTypeRam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as ITypeRam;
        await TypeRamModel.create({ name: name });
        return res.json({ message: MSG_CREATE_TYPE_RAM_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateTypeRam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as ITypeRam;
        const update = await TypeRamModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_TYPE_RAM_FAIL);

        return res.json({ message: MSG_UPDATE_TYPE_RAM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteTypeRam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await TypeRamModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_TYPE_RAM_FAIL);

        return res.json({ message: MSG_UPDATE_TYPE_RAM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
