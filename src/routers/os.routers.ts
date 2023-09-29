import express, { Router } from "express";
import { createOs, deleteOs, getAllOs, updateOs } from "../controllers/os.controller";
import verifyAdmin from "../middlewares/verify-admin";

const osRouters: Router = express.Router();

osRouters.get("/", getAllOs);
osRouters.post("/", verifyAdmin, createOs);
osRouters.put("/", verifyAdmin, updateOs);
osRouters.delete("/:id", verifyAdmin, deleteOs);

export default osRouters;
