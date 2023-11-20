import express, { Router } from "express";
import { createChat, findChat, userChat } from "../controllers/chat.controller";

const chatRouters: Router = express.Router();

chatRouters.post("/", createChat);
chatRouters.get("/:userId", userChat);
chatRouters.post("/find", findChat);

export default chatRouters;
