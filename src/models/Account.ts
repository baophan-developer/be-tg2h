import { Schema, model } from "mongoose";

export interface IAccounting {
    owner: Schema.Types.ObjectId;
    accountBalance: number;
    bank: {
        fullName: string;
        /** CMND */
        numberId: string;
        bankName: string;
        numberAccount: string;
    };
}

const schemaAccounting = new Schema<IAccounting>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    accountBalance: {
        type: Number,
        default: 0,
    },
    bank: {
        fullName: String,
        numberId: String,
        bankName: String,
        numberAccount: String,
    },
});

const AccountingModel = model<IAccounting>("Accounting", schemaAccounting);

export default AccountingModel;

/**
 * Tài chính được cập nhật khi đơn hàng được thanh toán và đơn hàng được duyệt.
 */
