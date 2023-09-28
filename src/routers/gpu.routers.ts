import express, { Router } from "express";
import {
    createGpu,
    deleteGpu,
    getAllGpu,
    updateGpu,
} from "../controllers/gpu.controller";

const gpuRouters: Router = express.Router();

gpuRouters.get("/", getAllGpu);
gpuRouters.post("/create", createGpu);
gpuRouters.put("/update", updateGpu);
gpuRouters.delete("/delete/:id", deleteGpu);

export default gpuRouters;
