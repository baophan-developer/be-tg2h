import { NextFunction, Request, Response } from "express";
import ChatModel from "../models/Chat";
import ResponseError from "../utils/error-api";
import MessageModel from "../models/Message";

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { senderId, receiverId } = req.body;

        // check duplicate chat
        const chatsOfSenderId = await ChatModel.find({
            members: { $in: [senderId] },
        });

        const chatsOfReceiverId = chatsOfSenderId.filter((item) =>
            item.members.includes(receiverId)
        );

        if (chatsOfReceiverId.length !== 0) return res.json({ message: "Chat is exist" });

        const result = await ChatModel.create({
            members: [senderId, receiverId],
        });

        return res.json(result);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const userChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const chat = await ChatModel.find({ members: { $in: [userId] } })
            .populate("members")
            .exec();

        return res.json(chat);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const findChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { senderId, receiverId } = req.body;

        const chat = await ChatModel.findOne({
            members: { $all: [senderId, receiverId] },
        })
            .populate("members")
            .exec();

        return res.json(chat);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Delete messages in chat
        await MessageModel.deleteMany({ chatId: id }).exec();

        // Delete chat
        await ChatModel.findByIdAndDelete(id).exec();

        return res.json({ message: "Xóa tin nhắn thành công." });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
