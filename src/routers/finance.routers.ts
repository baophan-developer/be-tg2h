import express, { Router } from "express";
import { calculatorRevenue } from "../controllers/finance.controller";

const financeRouters: Router = express.Router();

financeRouters.post("/", calculatorRevenue);

export default financeRouters;
