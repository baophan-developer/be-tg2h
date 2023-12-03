import express, { Router } from "express";
import {
    approveProduct,
    createProduct,
    getDetailProduct,
    getProducts,
    getProductsRatingHigh,
    getProductsSoldHigh,
    getTopSaleHigh,
    rejectProduct,
    updateProduct,
} from "../controllers/product.controller";
import { uploadMemories } from "../configs/upload.config";
import verifyAdmin from "../middlewares/verify-admin";

const productRouters: Router = express.Router();

productRouters.get("/:id", getDetailProduct);
productRouters.post("/", getProducts);
productRouters.post("/create", uploadMemories.array("images"), createProduct);
productRouters.put("/", uploadMemories.array("images"), updateProduct);
productRouters.put("/approve", verifyAdmin, approveProduct);
productRouters.put("/reject", verifyAdmin, rejectProduct);

productRouters.post("/rating-high", getProductsRatingHigh);
productRouters.post("/sold-high", getProductsSoldHigh);
productRouters.post("/top-sale", getTopSaleHigh);

export default productRouters;
