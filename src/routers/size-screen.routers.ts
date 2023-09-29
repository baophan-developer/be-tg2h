import express, { Router } from "express";
import {
    createSizeScreen,
    deleteSizeScreen,
    getAllSizeScreen,
    updateSizeScreen,
} from "../controllers/size-screen.controller";
import verifyAdmin from "../middlewares/verify-admin";

const sizeScreenRouters: Router = express.Router();

sizeScreenRouters.get("/", getAllSizeScreen);
sizeScreenRouters.post("/", verifyAdmin, createSizeScreen);
sizeScreenRouters.put("/", verifyAdmin, updateSizeScreen);
sizeScreenRouters.delete("/:id", verifyAdmin, deleteSizeScreen);

export default sizeScreenRouters;
