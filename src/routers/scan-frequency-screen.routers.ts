import express, { Router } from "express";
import {
    createScanFrequencyScreen,
    deleteScanFrequencyScreen,
    getAllScanFrequencyScreen,
    updateScanFrequencyScreen,
} from "../controllers/scan-frequency-screen.controller";
import verifyAdmin from "../middlewares/verify-admin";

const scanFrequencyScreenRouters: Router = express.Router();

scanFrequencyScreenRouters.get("/", getAllScanFrequencyScreen);
scanFrequencyScreenRouters.post("/", verifyAdmin, createScanFrequencyScreen);
scanFrequencyScreenRouters.put("/", verifyAdmin, updateScanFrequencyScreen);
scanFrequencyScreenRouters.delete("/:id", verifyAdmin, deleteScanFrequencyScreen);

export default scanFrequencyScreenRouters;
