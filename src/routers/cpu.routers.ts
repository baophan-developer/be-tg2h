import express, { Router } from "express";
import {
    createCpu,
    deleteCpu,
    getAllCpu,
    updateCpu,
} from "../controllers/cpu.controller";

const cpuRouters: Router = express.Router();

cpuRouters.get("/", getAllCpu);
cpuRouters.post("/create", createCpu);
cpuRouters.put("/update", updateCpu);
cpuRouters.delete("/delete/:id", deleteCpu);

export default cpuRouters;
