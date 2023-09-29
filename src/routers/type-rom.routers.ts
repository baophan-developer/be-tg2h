import express, { Router } from "express";
import {
    createTypeRom,
    deleteTypeRom,
    getAllTypeRom,
    updateTypeRom,
} from "../controllers/type-rom.controller";
import verifyAdmin from "../middlewares/verify-admin";

const typeRomRouters: Router = express.Router();

typeRomRouters.get("/", getAllTypeRom);
typeRomRouters.post("/", verifyAdmin, createTypeRom);
typeRomRouters.put("/", verifyAdmin, updateTypeRom);
typeRomRouters.delete("/:id", verifyAdmin, deleteTypeRom);

export default typeRomRouters;
