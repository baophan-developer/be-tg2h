import { Schema, model } from "mongoose";
import DISCOUNT from "../constants/discount";

export interface IDiscount {
    id: Schema.Types.ObjectId;
    code: string;
    productId: Schema.Types.ObjectId;
    start: Date;
    end: Date;
    amount: number;
    used: number;
    status: boolean;
    percent: number;
}

const schemaDiscount = new Schema<IDiscount>({
    code: {
        type: String,
        required: [true, "Mã giảm giá là bắt buộc."],
        min: [DISCOUNT.MIN, "Mã giảm giá phải ít nhất {VALUE} ký tự."],
        max: [DISCOUNT.MIN, "Mã giảm giá không được vượt {VALUE} ký tự."],
        uppercase: true,
    },
    start: {
        type: Date,
        required: [true, "Ngày bắt đầu giảm giá là bắt buộc."],
        min: Date.now(),
    },
    end: {
        type: Date,
        required: [true, "Ngày kết thúc giảm giá là bắt buộc."],
    },
    amount: {
        type: Number,
        required: [true, "Số lượng phiếu giảm giá sản phẩm là bắt buộc."],
        min: [DISCOUNT.MIN, `Số lượng phiếu giảm giá không được ít hơn {VALUE} phiếu.`],
        max: [
            DISCOUNT.MAX,
            `Số lượng phiếu giảm giá không được nhiều hơn {VALUE} phiếu.`,
        ],
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    used: Number,
    status: Boolean,
    percent: Number,
});

const DiscountModel = model<IDiscount>("Discount", schemaDiscount);

export default DiscountModel;
