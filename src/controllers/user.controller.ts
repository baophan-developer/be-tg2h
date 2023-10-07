import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import ResponseError from "../utils/error-api";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filter, sort, pagination } = req.body;

        const defaultPage = 0;
        const defaultLimit = 10;

        const limit = pagination?.limit || defaultLimit;
        const skip = pagination?.page * pagination?.limit || defaultPage;

        const count = await UserModel.find().count();

        const users = await UserModel.find(
            filter,
            "-__v -password -refreshToken -createdAt -updatedAt -role",
            {
                skip: skip,
                limit: limit,
                sort,
            }
        )
            .populate("address", "address -_id")
            .populate("favorites")
            .exec();

        return res.json({
            list: users,
            total: count,
            page: pagination?.page || defaultPage,
            limit: pagination?.limit || defaultLimit,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getDetailUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(
            id,
            "-__v -password -refreshToken -createdAt -updatedAt -role"
        )
            .populate("address", "address -_id")
            .populate("favorites")
            .exec();

        return res.json({ item: user });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
