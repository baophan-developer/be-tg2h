import { Schema, model } from "mongoose";

export interface IAccount {
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

const schemaAccount = new Schema<IAccount>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

const AccountModel = model<IAccount>("Account", schemaAccount);

export default AccountModel;
