import express, { Router } from "express";
import { createOs, deleteOs, getAllOs, updateOs } from "../controllers/os.controller";

const osRouters: Router = express.Router();

osRouters.get("/", getAllOs);
osRouters.post("/create", createOs);
osRouters.put("/update", updateOs);
osRouters.delete("/delete/:id", deleteOs);

export default osRouters;
