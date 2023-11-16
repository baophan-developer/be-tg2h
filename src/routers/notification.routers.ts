import express, { Router } from "express";
import {
    createNotification,
    getAllNotification,
    getCountNotificationNotSeen,
    updateSeenNotification,
} from "../controllers/notification.controller";

const notificationRouters: Router = express.Router();

notificationRouters.post("/create", createNotification);
notificationRouters.post("/get-all", getAllNotification);
notificationRouters.get("/", getCountNotificationNotSeen);
notificationRouters.put("/", updateSeenNotification);

export default notificationRouters;
