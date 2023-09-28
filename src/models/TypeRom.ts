import { Schema, model } from "mongoose";

export interface ITypeRom {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaTypeRom = new Schema<ITypeRom>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const TypeRomModel = model<ITypeRom>("TypeRom", schemaTypeRom);

export default TypeRomModel;
