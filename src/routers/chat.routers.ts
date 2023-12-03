import express, { Router } from "express";
import {
    createChat,
    deleteChat,
    findChat,
    userChat,
} from "../controllers/chat.controller";

const chatRouters: Router = express.Router();

chatRouters.post("/", createChat);
chatRouters.get("/:userId", userChat);
chatRouters.post("/find", findChat);
chatRouters.delete("/:id", deleteChat);

export default chatRouters;
