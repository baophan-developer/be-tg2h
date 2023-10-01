import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import CapacityRamModel, { ICapacityRam } from "../models/CapacityRam";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_CAPACITY_RAM_SUCCESS,
    MSG_DELETE_CAPACITY_RAM_FAIL,
    MSG_DELETE_CAPACITY_RAM_SUCCESS,
    MSG_UPDATE_CAPACITY_RAM_FAIL,
    MSG_UPDATE_CAPACITY_RAM_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";

export const getAllCapacityRam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const list = await CapacityRamModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createCapacityRam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { capacity } = req.body as ICapacityRam;
        await CapacityRamModel.create({ capacity: capacity });
        return res.json({ message: MSG_CREATE_CAPACITY_RAM_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateCapacityRam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, capacity } = req.body as ICapacityRam;
        const update = await CapacityRamModel.findByIdAndUpdate(
            id,
            {
                $set: { capacity: capacity },
            },
            { new: true, runValidators: true }
        );
        if (!update)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_UPDATE_CAPACITY_RAM_FAIL
            );

        return res.json({ message: MSG_UPDATE_CAPACITY_RAM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteCapacityRam = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleteItem = await CapacityRamModel.findByIdAndDelete(id).exec();

        if (!deleteItem)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_DELETE_CAPACITY_RAM_FAIL
            );

        return res.json({ message: MSG_DELETE_CAPACITY_RAM_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
