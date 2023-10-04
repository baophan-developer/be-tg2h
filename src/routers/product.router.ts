import express, { Router } from "express";
import {
    createProduct,
    getDetailProduct,
    getProducts,
} from "../controllers/product.controller";
import { uploadMemories } from "../configs/upload.config";

const productRouters: Router = express.Router();

productRouters.post("/", getProducts);
productRouters.post("/create", uploadMemories.array("images"), createProduct);
productRouters.get("/:id", getDetailProduct);

export default productRouters;
