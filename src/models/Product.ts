import { Schema, model } from "mongoose";

export interface IProduct {
    name: string;
}

const productSchema = new Schema<IProduct>({
    name: String,
});

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
// temp
