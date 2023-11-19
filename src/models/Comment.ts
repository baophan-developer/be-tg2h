import { Schema, model } from "mongoose";

export interface IComment {
    product: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    rating: number;
    content: string;
}

const schemaComment = new Schema<IComment>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: [true, "Bạn chưa xếp hạng sản phẩm"],
            min: 0,
            max: 5,
        },
        content: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const CommentModel = model<IComment>("Comment", schemaComment);

export default CommentModel;
