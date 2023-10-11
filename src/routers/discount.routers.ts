import express, { Router } from "express";
import {
    createDiscount,
    getDiscount,
    updateDiscount,
} from "../controllers/discount.controller";

const discountRouters: Router = express.Router();

discountRouters.get("/:id", getDiscount);
discountRouters.post("/", createDiscount);
discountRouters.put("/", updateDiscount);

export default discountRouters;
