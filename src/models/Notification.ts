import { Schema, model } from "mongoose";

export interface INotification {
    userReceive: Schema.Types.ObjectId;
    title: string;
    message: string;
    isSeen: boolean;
    /** using like is url for action front-end */
    action: string;
}

const schemaNotification = new Schema<INotification>(
    {
        userReceive: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isSeen: {
            type: Boolean,
            default: false,
        },
        action: String,
    },
    { timestamps: true }
);

const NotificationModel = model<INotification>("Notification", schemaNotification);

export default NotificationModel;
