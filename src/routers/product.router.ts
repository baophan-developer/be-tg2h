import express, { Router } from "express";
import {
    approveProduct,
    createProduct,
    getDetailProduct,
    getProducts,
    rejectProduct,
    updateProduct,
} from "../controllers/product.controller";
import { uploadMemories } from "../configs/upload.config";
import verifyAdmin from "../middlewares/verify-admin";

const productRouters: Router = express.Router();

productRouters.get("/:id", getDetailProduct);
productRouters.post("/", getProducts);
productRouters.post("/create", uploadMemories.array("images"), createProduct);
productRouters.post("/update", uploadMemories.array("images"), updateProduct);
productRouters.post("/approve", verifyAdmin, approveProduct);
productRouters.post("/reject", verifyAdmin, rejectProduct);

export default productRouters;
