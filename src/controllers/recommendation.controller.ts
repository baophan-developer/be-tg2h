import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";

export const recommendation = (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
