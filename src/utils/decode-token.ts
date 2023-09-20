import jwt from "jsonwebtoken";
import { Request } from "express";
import mongoose from "mongoose";

type TDecodeJWT = {
    userId: mongoose.Types.ObjectId;
    role: string;
};

export default function decodeToken(req: Request): TDecodeJWT {
    const tokenBearer = req.headers.authorization || "";
    const accessToken = tokenBearer.slice(7);
    const decodeJwt = jwt.decode(accessToken) as TDecodeJWT;
    return {
        userId: decodeJwt.userId,
        role: decodeJwt.role,
    };
}
