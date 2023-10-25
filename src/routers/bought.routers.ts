import express, { Router } from "express";
import { getBought } from "../controllers/bought.controller";

const boughtRouters: Router = express.Router();

boughtRouters.post("/", getBought);

export default boughtRouters;
