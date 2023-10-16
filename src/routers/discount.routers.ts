import express, { Router } from "express";
import {
    createDiscount,
    getDiscount,
    updateDiscount,
    useDiscount,
} from "../controllers/discount.controller";

const discountRouters: Router = express.Router();

discountRouters.get("/:id", getDiscount);
discountRouters.post("/", createDiscount);
discountRouters.put("/", updateDiscount);
discountRouters.post("/use", useDiscount);

export default discountRouters;
