import { Schema, model } from "mongoose";
import { EOrder, EStatusShipping } from "../enums/order.enum";

export interface IOrder {
    id: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
    seller: Schema.Types.ObjectId;
    shipping: Schema.Types.ObjectId;
    payment: Schema.Types.ObjectId;
    pickupAddress: string;
    deliveryAddress: string;
    items: {
        product: Schema.Types.ObjectId;
        discount: Schema.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPayment: number;
    statusPayment: boolean;
    statusShipping:
        | EStatusShipping.PENDING
        | EStatusShipping.PREPARING
        | EStatusShipping.IN_STORE
        | EStatusShipping.DELIVER_RECEIVE_ITEM
        | EStatusShipping.DELIVERING
        | EStatusShipping.DELIVERED;
    statusOrder: EOrder.ORDERED | EOrder.CANCEL | EOrder.FINISH;
    reasonCancel: string;
    /** status is status order wait seller accept order */
    status: boolean;
}

const schemaOrder = new Schema<IOrder>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    seller: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    shipping: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shipping",
    },
    payment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Payment",
    },
    deliveryAddress: {
        type: String,
    },
    pickupAddress: {
        type: String,
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            discount: {
                type: Schema.Types.ObjectId,
                ref: "Discount",
            },
            quantity: Number,
            price: Number,
        },
    ],
    totalPayment: {
        type: Number,
        required: true,
    },
    statusPayment: {
        type: Boolean,
        default: false,
    },
    statusShipping: {
        type: String,
        enum: [
            EStatusShipping.PENDING,
            EStatusShipping.PREPARING,
            EStatusShipping.IN_STORE,
            EStatusShipping.DELIVER_RECEIVE_ITEM,
            EStatusShipping.DELIVERING,
            EStatusShipping.DELIVERED,
        ],
        default: EStatusShipping.PENDING,
    },
    statusOrder: {
        type: String,
        enum: [EOrder.CANCEL, EOrder.FINISH, EOrder.ORDERED],
        default: EOrder.ORDERED,
    },
    reasonCancel: {
        type: String,
        default: "",
    },
    status: {
        type: Boolean,
        default: false,
    },
});

const OrderModel = model<IOrder>("Order", schemaOrder);

export default OrderModel;
