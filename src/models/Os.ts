import { Schema, model } from "mongoose";

export interface IOs {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaOs = new Schema<IOs>(
    {
        name: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const OsModel = model<IOs>("OS", schemaOs);

export default OsModel;
