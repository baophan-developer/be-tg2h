import express, { Router } from "express";
import verifyAdmin from "../middlewares/verify-admin";
import { addShipping, getAllShipping } from "../controllers/shipping.controller";
import handleUpload from "../configs/cloudinary.config";
import { uploadMemories } from "../configs/upload.config";

const shippingRouters: Router = express.Router();

shippingRouters.get("/", getAllShipping);
shippingRouters.post("/", verifyAdmin, uploadMemories.single("avatar"), addShipping);

export default shippingRouters;
