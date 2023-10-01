import { Schema, model } from "mongoose";

export interface ISizeScreen {
    id: Schema.Types.ObjectId;
    size: string;
}

const schemaSizeScreen = new Schema<ISizeScreen>(
    {
        size: {
            type: String,
            unique: true,
            required: [true, "Kích cỡ màn hình là bắt buộc."],
        },
    },
    { timestamps: true }
);

const SizeScreenModel = model<ISizeScreen>("SizeScreen", schemaSizeScreen);

export default SizeScreenModel;
