import express, { Router } from "express";
import { addPayment, getAllPayment } from "../controllers/payment.controller";
import verifyAdmin from "../middlewares/verify-admin";
import { uploadMemories } from "../configs/upload.config";

const paymentRouters: Router = express.Router();

paymentRouters.get("/", getAllPayment);
paymentRouters.post("/", verifyAdmin, uploadMemories.single("avatar"), addPayment);

export default paymentRouters;
