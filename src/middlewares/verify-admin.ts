import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import { ERole } from "../models/Role";
import HttpStatusCode from "../enums/http-status-code";
import { MSG_ERROR_FORBIDDEN } from "../constants/messages";

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = decodeToken(req);
        if (role === ERole.admin) return next();
        throw new ResponseError(HttpStatusCode.FORBIDDEN, MSG_ERROR_FORBIDDEN);
    } catch (error: ResponseError | any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export default verifyAdmin;
