import express, { Router } from "express";
import {
    createTypeRam,
    deleteTypeRam,
    getAllTypeRam,
    updateTypeRam,
} from "../controllers/type-ram.controller";
import verifyAdmin from "../middlewares/verify-admin";

const typeRamRouters: Router = express.Router();

typeRamRouters.get("/", getAllTypeRam);
typeRamRouters.post("/", verifyAdmin, createTypeRam);
typeRamRouters.put("/", verifyAdmin, updateTypeRam);
typeRamRouters.delete("/:id", verifyAdmin, deleteTypeRam);

export default typeRamRouters;
