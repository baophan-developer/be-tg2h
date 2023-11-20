import { Schema, model } from "mongoose";

export interface IChat {
    members: Schema.Types.ObjectId[];
}

const schemaChat = new Schema<IChat>(
    {
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const ChatModel = model<IChat>("Chat", schemaChat);

export default ChatModel;
