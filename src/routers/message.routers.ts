import express, { Router } from "express";
import { addMessage, getMessages } from "../controllers/message.controller";

const messageRouters: Router = express.Router();

messageRouters.post("/", addMessage); // Add message
messageRouters.get("/:chatId", getMessages); // Get message

export default messageRouters;
