import { Schema, model } from "mongoose";
import { EOrder, EStatusShipping } from "../enums/order.enum";

export interface IOrder {
    id: Schema.Types.ObjectId;
    code: string;
    owner: Schema.Types.ObjectId;
    seller: Schema.Types.ObjectId;
    shipping: Schema.Types.ObjectId;
    payment: Schema.Types.ObjectId;
    pickupAddress: string;
    deliveryAddress: string;
    items: {
        product: Schema.Types.ObjectId;
        discount: {
            code: string;
            percent: number;
        };
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
    dayReceiveOrder: Date;
    statusOrder:
        | EOrder.ORDERED
        | EOrder.CANCEL
        | EOrder.FINISH
        | EOrder.DELIVERING
        | EOrder.REQUEST_REFUND;
    reasonCancel: string;
    /** status is status order wait seller accept order */
    status: boolean;
    refund: boolean;
    //  Confirm user received
    received: boolean;
}

const schemaOrder = new Schema<IOrder>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
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
            required: true,
        },
        pickupAddress: {
            type: String,
            required: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
                discount: {
                    code: String,
                    percent: Number,
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
                EStatusShipping.CANCEL,
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
            enum: [
                EOrder.CANCEL,
                EOrder.FINISH,
                EOrder.ORDERED,
                EOrder.DELIVERING,
                EOrder.REQUEST_REFUND,
            ],
            default: EOrder.ORDERED,
        },
        dayReceiveOrder: {
            type: Date,
        },
        reasonCancel: {
            type: String,
            default: "",
        },
        refund: {
            type: Boolean,
            default: false,
        },
        received: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const OrderModel = model<IOrder>("Order", schemaOrder);

export default OrderModel;
