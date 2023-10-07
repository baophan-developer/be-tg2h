import express, { Router } from "express";
import { getAllUsers, getDetailUser } from "../controllers/user.controller";

const userRouters: Router = express.Router();

userRouters.post("/", getAllUsers);
userRouters.get("/:id", getDetailUser);

export default userRouters;
