import { Schema, model } from "mongoose";

export interface IMessage {
    chatId: string;
    senderId: string;
    content: string;
}

const schemaMessage = new Schema<IMessage>(
    {
        chatId: String,
        senderId: String,
        content: String,
    },
    { timestamps: true }
);

const MessageModel = model<IMessage>("Message", schemaMessage);

export default MessageModel;
