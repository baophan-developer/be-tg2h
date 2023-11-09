import { NextFunction, Request, Response } from "express";
import decodeToken from "../utils/decode-token";
import AccountingModel from "../models/Account";
import ResponseError from "../utils/error-api";

export const getInfoAccountingUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = decodeToken(req);
        const accounting = await AccountingModel.findOne({ owner: userId });
        return res.json(accounting);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
