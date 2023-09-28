import express, { Router } from "express";
import {
    createTypeRom,
    deleteTypeRom,
    getAllTypeRom,
    updateTypeRom,
} from "../controllers/type-rom.controller";

const typeRomRouters: Router = express.Router();

typeRomRouters.get("/", getAllTypeRom);
typeRomRouters.post("/create", createTypeRom);
typeRomRouters.put("/update", updateTypeRom);
typeRomRouters.delete("/delete/:id", deleteTypeRom);

export default typeRomRouters;
