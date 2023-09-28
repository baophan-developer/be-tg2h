import express, { Router } from "express";
import {
    createTypeRam,
    deleteTypeRam,
    getAllTypeRam,
    updateTypeRam,
} from "../controllers/type-ram.controller";

const typeRamRouters: Router = express.Router();

typeRamRouters.get("/", getAllTypeRam);
typeRamRouters.post("/create", createTypeRam);
typeRamRouters.put("/update", updateTypeRam);
typeRamRouters.delete("/delete/:id", deleteTypeRam);

export default typeRamRouters;
