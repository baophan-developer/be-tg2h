import { Schema, model } from "mongoose";

export interface ICapacityRom {
    id: Schema.Types.ObjectId;
    capacity: string;
}

const schemaCapacityRom = new Schema<ICapacityRom>(
    {
        capacity: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const CapacityRomModel = model<ICapacityRom>("CapacityRom", schemaCapacityRom);

export default CapacityRomModel;
