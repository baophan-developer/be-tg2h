import express, { Router } from "express";
import {
    getAllBranch,
    createBranch,
    updateBranch,
    deleteBranch,
} from "./../controllers/branch.controller";

const branchRouters: Router = express.Router();

branchRouters.get("/", getAllBranch);
branchRouters.post("/create", createBranch);
branchRouters.put("/update", updateBranch);
branchRouters.delete("/delete/:id", deleteBranch);

export default branchRouters;
