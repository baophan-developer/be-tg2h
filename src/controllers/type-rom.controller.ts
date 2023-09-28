import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_TYPE_ROM_SUCCESS,
    MSG_DELETE_TYPE_ROM_FAIL,
    MSG_DELETE_TYPE_ROM_SUCCESS,
    MSG_UPDATE_TYPE_ROM_FAIL,
    MSG_UPDATE_TYPE_ROM_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import TypeRomModel, { ITypeRom } from "../models/TypeRom";

export const getAllTypeRom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await TypeRomModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createTypeRom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as ITypeRom;
        await TypeRomModel.create({ name: name });
        return res.json({ message: MSG_CREATE_TYPE_ROM_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateTypeRom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as ITypeRom;
        const update = await TypeRomModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_TYPE_ROM_FAIL);

        return res.json({ message: MSG_UPDATE_TYPE_ROM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteTypeRom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await TypeRomModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_TYPE_ROM_FAIL);

        return res.json({ message: MSG_DELETE_TYPE_ROM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
