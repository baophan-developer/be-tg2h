import express, { Router } from "express";
import {
    createSizeScreen,
    deleteSizeScreen,
    getAllSizeScreen,
    updateSizeScreen,
} from "../controllers/size-screen.controller";

const sizeScreenRouters: Router = express.Router();

sizeScreenRouters.get("/", getAllSizeScreen);
sizeScreenRouters.post("/create", createSizeScreen);
sizeScreenRouters.put("/update", updateSizeScreen);
sizeScreenRouters.delete("/delete/:id", deleteSizeScreen);

export default sizeScreenRouters;
