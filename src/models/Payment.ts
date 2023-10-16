import { Schema, model } from "mongoose";

export interface IPayment {
    id: Schema.Types.ObjectId;
    name: string;
    avatar: string;
    status: string;
}

const schemaPayment = new Schema<IPayment>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    status: Boolean,
});

const PaymentModel = model<IPayment>("Payment", schemaPayment);

export default PaymentModel;
