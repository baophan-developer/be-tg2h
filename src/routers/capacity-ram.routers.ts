import express, { Router } from "express";
import {
    createCapacityRam,
    deleteCapacityRam,
    getAllCapacityRam,
    updateCapacityRam,
} from "../controllers/capacity-ram.controller";
import verifyAdmin from "../middlewares/verify-admin";

const capacityRamRouters: Router = express.Router();

capacityRamRouters.get("/", getAllCapacityRam);
capacityRamRouters.post("/", verifyAdmin, createCapacityRam);
capacityRamRouters.put("/", verifyAdmin, updateCapacityRam);
capacityRamRouters.delete("/:id", verifyAdmin, deleteCapacityRam);

export default capacityRamRouters;
