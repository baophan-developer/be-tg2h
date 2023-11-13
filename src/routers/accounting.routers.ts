import express, { Router } from "express";
import { getInfoAccountingUser } from "../controllers/account.controller";

const accountingRouters: Router = express.Router();

accountingRouters.get("/", getInfoAccountingUser);

export default accountingRouters;
