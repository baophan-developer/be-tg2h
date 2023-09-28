import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_GPU_SUCCESS,
    MSG_DELETE_GPU_FAIL,
    MSG_DELETE_GPU_SUCCESS,
    MSG_UPDATE_GPU_FAIL,
    MSG_UPDATE_GPU_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import GpuModel, { IGpu } from "../models/Gpu";

export const getAllGpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await GpuModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createGpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IGpu;
        await GpuModel.create({ name: name });
        return res.json({ message: MSG_CREATE_GPU_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateGpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as IGpu;
        const update = await GpuModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_GPU_FAIL);

        return res.json({ message: MSG_UPDATE_GPU_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteGpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await GpuModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_GPU_FAIL);

        return res.json({ message: MSG_DELETE_GPU_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
