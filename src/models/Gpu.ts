import { Schema, model } from "mongoose";

export interface IGpu {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaGpu = new Schema<IGpu>(
    {
        name: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const GpuModel = model<IGpu>("GPU", schemaGpu);

export default GpuModel;
