import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import { Schema } from "mongoose";
import BoughtModel from "../models/Bought";

interface IQuery {
    filters: {
        owner: Schema.Types.ObjectId;
    };
}

export const getBought = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filters } = req.body as IQuery;

        const bought = await BoughtModel.findOne(filters);

        return res.json({ item: bought });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
