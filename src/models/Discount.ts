import { Schema, model } from "mongoose";
import DISCOUNT from "../constants/discount";

export interface IDiscount {
    id: Schema.Types.ObjectId;
    start: Date;
    end: Date;
    amount: number;
    used: number;
    status: boolean;
    percent: number;
}

const schemaDiscount = new Schema<IDiscount>({
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
    used: Number,
    status: Boolean,
    percent: Number,
});

const DiscountModel = model<IDiscount>("Discount", schemaDiscount);

export default DiscountModel;
