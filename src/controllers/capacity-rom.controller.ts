import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_CAPACITY_ROM_SUCCESS,
    MSG_DELETE_CAPACITY_ROM_FAIL,
    MSG_DELETE_CAPACITY_ROM_SUCCESS,
    MSG_UPDATE_CAPACITY_ROM_FAIL,
    MSG_UPDATE_CAPACITY_ROM_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import CapacityRomModel, { ICapacityRom } from "../models/CapacityRom";

export const getAllCapacityRom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const list = await CapacityRomModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createCapacityRom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { capacity } = req.body as ICapacityRom;
        await CapacityRomModel.create({ capacity: capacity });
        return res.json({ message: MSG_CREATE_CAPACITY_ROM_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateCapacityRom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, capacity } = req.body as ICapacityRom;
        const update = await CapacityRomModel.findByIdAndUpdate(
            id,
            { $set: { capacity: capacity } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_UPDATE_CAPACITY_ROM_FAIL
            );

        return res.json({ message: MSG_UPDATE_CAPACITY_ROM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteCapacityRom = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleteItem = await CapacityRomModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_DELETE_CAPACITY_ROM_FAIL
            );

        return res.json({ message: MSG_DELETE_CAPACITY_ROM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
