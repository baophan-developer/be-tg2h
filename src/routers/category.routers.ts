import express, { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    updateCategory,
} from "../controllers/category.controller";

const categoryRouters: Router = express.Router();

categoryRouters.get("/", getAllCategory);
categoryRouters.post("/create", createCategory);
categoryRouters.put("/update", updateCategory);
categoryRouters.delete("/delete/:id", deleteCategory);

export default categoryRouters;
