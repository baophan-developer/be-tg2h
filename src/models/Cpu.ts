import { Schema, model } from "mongoose";

export interface ICpu {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaCpu = new Schema<ICpu>(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

const CpuModel = model<ICpu>("CPU", schemaCpu);

export default CpuModel;
