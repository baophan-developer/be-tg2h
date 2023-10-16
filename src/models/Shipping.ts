import { Schema, model } from "mongoose";

export interface IShipping {
    id: Schema.Types.ObjectId;
    name: string;
    avatar: string;
    status: string;
}

const schemaShipping = new Schema<IShipping>(
    {
        name: { type: String, required: true, unique: true },
        avatar: { type: String, required: true },
        status: Boolean,
    },
    { timestamps: true }
);

const ShippingModel = model<IShipping>("Shipping", schemaShipping);

export default ShippingModel;
