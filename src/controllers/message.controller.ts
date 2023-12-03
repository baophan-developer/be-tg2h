import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import MessageModel from "../models/Message";

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId, senderId, content } = req.body;

        const message = await MessageModel.create({
            chatId: chatId,
            senderId: senderId,
            content: content,
        });

        return res.json(message);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;

        const messages = await MessageModel.find({ chatId: chatId }).exec();

        return res.json(messages);
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
