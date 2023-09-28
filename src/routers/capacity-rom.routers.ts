import express, { Router } from "express";
import {
    createCapacityRom,
    deleteCapacityRom,
    getAllCapacityRom,
    updateCapacityRom,
} from "../controllers/capacity-rom.controller";

const capacityRomRouters: Router = express.Router();

capacityRomRouters.get("/", getAllCapacityRom);
capacityRomRouters.post("/create", createCapacityRom);
capacityRomRouters.put("/update", updateCapacityRom);
capacityRomRouters.delete("/delete/:id", deleteCapacityRom);

export default capacityRomRouters;
