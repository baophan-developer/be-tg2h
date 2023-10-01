import express, { Router } from "express";
import {
    createResolutionScreen,
    deleteResolutionScreen,
    getAllResolutionScreen,
    updateResolutionScreen,
} from "../controllers/resolution-screen.controller";
import verifyAdmin from "../middlewares/verify-admin";

const resolutionScreenRouters: Router = express.Router();

resolutionScreenRouters.get("/", getAllResolutionScreen);
resolutionScreenRouters.post("/", verifyAdmin, createResolutionScreen);
resolutionScreenRouters.put("/", verifyAdmin, updateResolutionScreen);
resolutionScreenRouters.delete("/:id", verifyAdmin, deleteResolutionScreen);

export default resolutionScreenRouters;
