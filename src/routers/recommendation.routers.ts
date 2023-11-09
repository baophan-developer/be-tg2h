import express, { Router } from "express";
import { recommendation } from "../controllers/recommendation.controller";

const recommendationRouters: Router = express.Router();

recommendationRouters.post("/", recommendation);

export default recommendationRouters;
