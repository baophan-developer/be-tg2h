import express, { Router } from "express";
import {
    createCapacityRom,
    deleteCapacityRom,
    getAllCapacityRom,
    updateCapacityRom,
} from "../controllers/capacity-rom.controller";
import verifyAdmin from "../middlewares/verify-admin";

const capacityRomRouters: Router = express.Router();

capacityRomRouters.get("/", getAllCapacityRom);
capacityRomRouters.post("/", verifyAdmin, createCapacityRom);
capacityRomRouters.put("/", verifyAdmin, updateCapacityRom);
capacityRomRouters.delete("/:id", verifyAdmin, deleteCapacityRom);

export default capacityRomRouters;
