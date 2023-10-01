import { Schema, model } from "mongoose";

export interface IBrand {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaBrand = new Schema<IBrand>(
    {
        name: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const BrandModel = model<IBrand>("Branch", schemaBrand);

export default BrandModel;
