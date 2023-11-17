import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import NotificationModel from "../models/Notification";

export const createNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userReceive, title, message, action } = req.body;

        await NotificationModel.create({
            userReceive: userReceive,
            title: title,
            message: message,
            action: action,
        });

        return res.json({ message: "Thêm mới thông báo thành công" });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getCountNotificationNotSeen = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = decodeToken(req);

        const count = await NotificationModel.find({ userReceive: userId, isSeen: false })
            .count()
            .exec();

        return res.json({ count: count });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getAllNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { pagination } = req.body;
        const { userId } = decodeToken(req);

        const defaultPage = 0;
        const defaultLimit = 10;

        const limit = pagination?.limit || defaultLimit;
        const skip = pagination?.page * pagination?.limit || defaultPage;

        const count = await NotificationModel.find({ userReceive: userId })
            .count()
            .exec();

        const notifications = await NotificationModel.find(
            { userReceive: userId },
            null,
            {
                skip: skip,
                limit: limit,
                sort: { isSeen: 1, createdAt: -1 },
            }
        ).exec();

        return res.json({
            list: notifications,
            total: count,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const updateSeenNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { notificationIds } = req.body;
        const { userId } = decodeToken(req);

        if (!notificationIds?.length)
            throw new ResponseError(422, "Bạn cần cung cấp mảng các Ids thông báo.");

        await NotificationModel.updateMany(
            { _id: { $in: notificationIds }, userReceive: userId },
            { $set: { isSeen: true } },
            { new: true }
        );

        return res.json({ message: "Cập nhật đã xem các thông báo thành công." });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
