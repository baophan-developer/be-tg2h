import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import HttpStatusCode from "../enums/http-status-code";
import { ILogin } from "../interfaces";
import { emailRegex } from "../regex";
import { MSG_ERROR_EMAIL_INCORRECT } from "../constants/messages";
import {
    MAX_LENGTH_PASSWORD_ACCEPT,
    MIN_LENGTH_PASSWORD_ACCEPT,
} from "../constants/user";

const checkLogin = (email: string, password: string): string | false => {
    if (!String(email).match(emailRegex)) return MSG_ERROR_EMAIL_INCORRECT;
    if (password.length > MAX_LENGTH_PASSWORD_ACCEPT)
        return `Mật khẩu không được quá ${MAX_LENGTH_PASSWORD_ACCEPT} ký tự.`;

    if (password.length < MIN_LENGTH_PASSWORD_ACCEPT)
        return `Mật khẩu không được ít hơn ${MIN_LENGTH_PASSWORD_ACCEPT} ký tự.`;

    return false;
};

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILogin;

    const result = checkLogin(email, password);

    if (result) {
        return next(new ResponseError(HttpStatusCode.BAD_REQUEST, result));
    }
    return next();
};

export default validateLogin;
