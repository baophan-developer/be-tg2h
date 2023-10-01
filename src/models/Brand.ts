import { Schema, model } from "mongoose";

export interface IBranch {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaBranch = new Schema<IBranch>(
    {
        name: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const BranchModel = model<IBranch>("Branch", schemaBranch);

export default BranchModel;
