import express, { Router } from "express";
import {
    createScanFrequencyScreen,
    deleteScanFrequencyScreen,
    getAllScanFrequencyScreen,
    updateScanFrequencyScreen,
} from "../controllers/scan-frequency-screen.controller";

const scanFrequencyScreenRouters: Router = express.Router();

scanFrequencyScreenRouters.get("/", getAllScanFrequencyScreen);
scanFrequencyScreenRouters.post("/create", createScanFrequencyScreen);
scanFrequencyScreenRouters.put("/update", updateScanFrequencyScreen);
scanFrequencyScreenRouters.delete("/delete/:id", deleteScanFrequencyScreen);

export default scanFrequencyScreenRouters;
