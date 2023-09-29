import express, { Router } from "express";
import {
    createGpu,
    deleteGpu,
    getAllGpu,
    updateGpu,
} from "../controllers/gpu.controller";
import verifyAdmin from "../middlewares/verify-admin";

const gpuRouters: Router = express.Router();

gpuRouters.get("/", getAllGpu);
gpuRouters.post("/", verifyAdmin, createGpu);
gpuRouters.put("/", verifyAdmin, updateGpu);
gpuRouters.delete("/:id", verifyAdmin, deleteGpu);

export default gpuRouters;
