import express, { Router } from "express";
import {
    getAllBrand,
    createBrand,
    updateBrand,
    deleteBrand,
} from "../controllers/brand.controller";
import verifyAdmin from "../middlewares/verify-admin";

const brandRouters: Router = express.Router();

brandRouters.get("/", getAllBrand);
brandRouters.post("/", verifyAdmin, createBrand);
brandRouters.put("/", verifyAdmin, updateBrand);
brandRouters.delete("/:id", verifyAdmin, deleteBrand);

export default brandRouters;
