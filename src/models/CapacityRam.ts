import { Schema, model } from "mongoose";

export interface ICapacityRam {
    id: Schema.Types.ObjectId;
    capacity: string;
}

const schemaCapacityRam = new Schema<ICapacityRam>({
    capacity: {
        type: String,
        required: true,
        unique: true,
    },
});

const CapacityRamModel = model<ICapacityRam>("CapacityRam", schemaCapacityRam);

export default CapacityRamModel;
