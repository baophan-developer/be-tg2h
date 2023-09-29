import express, { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    updateCategory,
} from "../controllers/category.controller";
import verifyAdmin from "../middlewares/verify-admin";

const categoryRouters: Router = express.Router();

categoryRouters.get("/", getAllCategory);
categoryRouters.post("/", verifyAdmin, createCategory);
categoryRouters.put("/", verifyAdmin, updateCategory);
categoryRouters.delete("/:id", verifyAdmin, deleteCategory);

export default categoryRouters;
