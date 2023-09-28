import { Schema, model } from "mongoose";

export interface ITypeRam {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaTypeRam = new Schema<ITypeRam>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const TypeRamModel = model<ITypeRam>("TypeRam", schemaTypeRam);

export default TypeRamModel;
