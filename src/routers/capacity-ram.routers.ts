import express, { Router } from "express";
import {
    createCapacityRam,
    deleteCapacityRam,
    getAllCapacityRam,
    updateCapacityRam,
} from "../controllers/capacity-ram.controller";

const capacityRamRouters: Router = express.Router();

capacityRamRouters.get("/", getAllCapacityRam);
capacityRamRouters.post("/create", createCapacityRam);
capacityRamRouters.put("/update", updateCapacityRam);
capacityRamRouters.delete("/delete/:id", deleteCapacityRam);

export default capacityRamRouters;
