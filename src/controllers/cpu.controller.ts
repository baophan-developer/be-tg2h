import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_CPU_SUCCESS,
    MSG_DELETE_CPU_FAIL,
    MSG_DELETE_CPU_SUCCESS,
    MSG_UPDATE_CPU_FAIL,
    MSG_UPDATE_CPU_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";
import CpuModel, { ICpu } from "../models/Cpu";

export const getAllCpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await CpuModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createCpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as ICpu;
        await CpuModel.create({ name: name });
        return res.json({ message: MSG_CREATE_CPU_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateCpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as ICpu;
        const update = await CpuModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        ).exec();
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_CPU_FAIL);

        return res.json({ message: MSG_UPDATE_CPU_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteCpu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await CpuModel.findByIdAndDelete(id).exec();
        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_CPU_FAIL);

        return res.json({ message: MSG_DELETE_CPU_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
