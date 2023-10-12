import { Schema, model } from "mongoose";

export interface ISessionCart {
    id: Schema.Types.ObjectId;
    ownerCart: Schema.Types.ObjectId;
    ownerProducts: Schema.Types.ObjectId;
    items: {
        product: Schema.Types.ObjectId;
        quantity: number;
    }[];
}

const schemaSessionCart = new Schema<ISessionCart>({
    ownerCart: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ownerProducts: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
        },
    ],
});

const SessionCartModel = model<ISessionCart>("SessionCart", schemaSessionCart);

export default SessionCartModel;
