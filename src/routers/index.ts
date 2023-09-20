import express from "express";
import authRouters from "./auth.routers";

const routers = express();

routers.use("/auth", authRouters);

export default routers;
