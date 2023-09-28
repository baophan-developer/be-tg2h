import { Schema, model } from "mongoose";

export interface ICategory {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaCategory = new Schema<ICategory>(
    {
        name: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

const CategoryModel = model<ICategory>("Category", schemaCategory);

export default CategoryModel;
