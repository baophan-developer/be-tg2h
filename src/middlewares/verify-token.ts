import jwt from "jsonwebtoken";
import configs from "../configs";
import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import HttpStatusCode from "../enums/http-status-code";
import {
    MSG_ERROR_TOKEN_EXPIRES,
    MSG_ERROR_TOKEN_NOT_EXISTED,
} from "../constants/messages";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const tokenBearer = req.headers.authorization || "";

    if (!tokenBearer)
        return next(
            new ResponseError(HttpStatusCode.FORBIDDEN, MSG_ERROR_TOKEN_NOT_EXISTED)
        );

    const accessToken = tokenBearer.slice(7);

    jwt.verify(accessToken, configs.jwt.accessToken.secret, async (err) => {
        if (err)
            return next(
                new ResponseError(HttpStatusCode.UNAUTHORIZED, MSG_ERROR_TOKEN_EXPIRES)
            );
        return next();
    });
};

export default verifyToken;
