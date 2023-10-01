import express, { Router } from "express";
import {
    getAllBranch,
    createBranch,
    updateBranch,
    deleteBranch,
} from "../controllers/brand.controller";
import verifyAdmin from "../middlewares/verify-admin";

const brandRouters: Router = express.Router();

brandRouters.get("/", getAllBranch);
brandRouters.post("/", verifyAdmin, createBranch);
brandRouters.put("/", verifyAdmin, updateBranch);
brandRouters.delete("/:id", verifyAdmin, deleteBranch);

export default brandRouters;
