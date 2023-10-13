import { Schema, model } from "mongoose";

export interface IOrder {
    id: Schema.Types.ObjectId;
    owner: Schema.Types.ObjectId;
    seller: Schema.Types.ObjectId;
    shipping: Schema.Types.ObjectId;
    payment: Schema.Types.ObjectId;
    items: [
        {
            product: Schema.Types.ObjectId;
            discount: Schema.Types.ObjectId;
            quantity: number;
            price: number;
        }
    ];
    totalPayment: number;
    statusPayment: boolean;
    statusShipping:
        | "Đang chuẩn bị hàng"
        | "Đang ở kho"
        | "Shipper đang lấy hàng"
        | "Shipper đang giao"
        | "Đã giao";
    statusOrder: boolean;
    /** status is status order wait seller accept order */
    status: boolean;
}

const schemaOrder = new Schema<IOrder>();

const OrderModel = model<IOrder>("Order", schemaOrder);
