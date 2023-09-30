import {
    MSG_DELETE_SCAN_FREQUENCY_SCREEN_FAIL,
    MSG_DELETE_SCAN_FREQUENCY_SCREEN_SUCCESS,
    MSG_UPDATE_SCAN_FREQUENCY_SCREEN_SUCCESS,
} from "./../constants/messages";
import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import ScanFrequencyScreenModel, {
    IScanFrequencyScreen,
} from "../models/ScanFrequencyScreen";
import {
    MSG_CREATE_SCAN_FREQUENCY_SCREEN_SUCCESS,
    MSG_UPDATE_SCAN_FREQUENCY_SCREEN_FAIL,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";

export const getAllScanFrequencyScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const list = await ScanFrequencyScreenModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createScanFrequencyScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { scanFrequency } = req.body as IScanFrequencyScreen;
        await ScanFrequencyScreenModel.create({ scanFrequency: scanFrequency });
        return res.json({ message: MSG_CREATE_SCAN_FREQUENCY_SCREEN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const updateScanFrequencyScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, scanFrequency } = req.body as IScanFrequencyScreen;
        const update = await ScanFrequencyScreenModel.findByIdAndUpdate(
            id,
            {
                $set: { scanFrequency: scanFrequency },
            },
            { new: true, runValidators: true }
        );
        if (!update)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_UPDATE_SCAN_FREQUENCY_SCREEN_FAIL
            );

        return res.json({ message: MSG_UPDATE_SCAN_FREQUENCY_SCREEN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteScanFrequencyScreen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const deleteItem = await ScanFrequencyScreenModel.findByIdAndDelete(id);
        if (!deleteItem)
            throw new ResponseError(
                HttpStatusCode.NOT_FOUND,
                MSG_DELETE_SCAN_FREQUENCY_SCREEN_FAIL
            );

        return res.json({ message: MSG_DELETE_SCAN_FREQUENCY_SCREEN_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
