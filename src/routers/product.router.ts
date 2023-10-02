import express, { Router } from "express";
import { createProduct, getProducts } from "../controllers/product.controller";
import { uploadMemories } from "../configs/upload.config";

const productRouters: Router = express.Router();

productRouters.post("/", getProducts);
productRouters.post("/create", uploadMemories.array("images"), createProduct);

export default productRouters;
