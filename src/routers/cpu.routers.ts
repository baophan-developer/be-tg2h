import express, { Router } from "express";
import {
    createCpu,
    deleteCpu,
    getAllCpu,
    updateCpu,
} from "../controllers/cpu.controller";
import verifyAdmin from "../middlewares/verify-admin";

const cpuRouters: Router = express.Router();

cpuRouters.get("/", getAllCpu);
cpuRouters.post("/", verifyAdmin, createCpu);
cpuRouters.put("/", verifyAdmin, updateCpu);
cpuRouters.delete("/:id", verifyAdmin, deleteCpu);

export default cpuRouters;
