import express, { Router } from "express";
import {
    getAllBranch,
    createBranch,
    updateBranch,
    deleteBranch,
} from "./../controllers/branch.controller";
import verifyAdmin from "../middlewares/verify-admin";

const branchRouters: Router = express.Router();

branchRouters.get("/", getAllBranch);
branchRouters.post("/", verifyAdmin, createBranch);
branchRouters.put("/", verifyAdmin, updateBranch);
branchRouters.delete("/:id", verifyAdmin, deleteBranch);

export default branchRouters;
