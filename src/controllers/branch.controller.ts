import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import BranchModel, { IBranch } from "../models/Branch";
import handleError from "../utils/handle-error";
import {
    MSG_CREATE_BRANCH_SUCCESS,
    MSG_DELETE_BRANCH_FAIL,
    MSG_DELETE_BRANCH_SUCCESS,
    MSG_UPDATE_BRANCH_FAIL,
    MSG_UPDATE_BRANCH_SUCCESS,
} from "../constants/messages";
import HttpStatusCode from "../enums/http-status-code";

export const getAllBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await BranchModel.find({}, "-__v");
        return res.json({ list });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IBranch;
        await BranchModel.create({ name: name });
        return res.json({ message: MSG_CREATE_BRANCH_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const updateBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.body as IBranch;
        const update = await BranchModel.findByIdAndUpdate(
            id,
            {
                $set: { name: name },
            },
            { new: true, runValidators: true }
        );
        if (!update)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_UPDATE_BRANCH_FAIL);

        return res.json({ message: MSG_UPDATE_BRANCH_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleteItem = await BranchModel.findByIdAndDelete(id).exec();

        if (!deleteItem)
            throw new ResponseError(HttpStatusCode.NOT_FOUND, MSG_DELETE_BRANCH_FAIL);

        return res.json({ message: MSG_DELETE_BRANCH_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
