import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import UserModel from "../models/User";
import HttpStatusCode from "../enums/http-status-code";
import { IRegisterUser } from "../interfaces";
import { MSG_ERROR_ACCOUNT_EXISTED } from "../constants/messages";

const checkDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as IRegisterUser;
        const user = await UserModel.findOne({ email: email }).exec();
        if (!user) {
            return next();
        }
        return next(
            new ResponseError(HttpStatusCode.BAD_REQUEST, MSG_ERROR_ACCOUNT_EXISTED)
        );
    } catch (error) {
        return next(new ResponseError(HttpStatusCode.INTERNAL_SERVER_ERROR, ""));
    }
};

export default checkDuplicateEmail;
