import { Schema, model } from "mongoose";

export interface IBought {
    _id: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
    products: Schema.Types.ObjectId[];
}

const schemaBought = new Schema<IBought>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const BoughtModel = model<IBought>("Bought", schemaBought);

export default BoughtModel;
