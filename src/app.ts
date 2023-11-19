import express, { Express, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import configs from "./configs";
import routers from "./routers";
import ResponseError from "./utils/error-api";
import HttpStatusCode from "./enums/http-status-code";

import http from "http";
import { Server } from "socket.io";

const corsOptions: CorsOptions = {
    origin: [configs.client.user, configs.client.admin],
};

const app: Express = express();
const httpServer = http.createServer(app);
const socketIO = new Server(httpServer, {
    cors: corsOptions,
});

let usersOnline: { socketId: string; userId: string }[] = [];

socketIO.on("connection", (socket) => {
    console.log(`User connected socket.id: ${socket.id}`);
    // Catch new user online system
    socket.on("userOnline", (data) => {
        // Check user online
        const index = usersOnline.findIndex((user) => user.userId == data.userId);
        if (index === -1) usersOnline.push(data);
        console.log(usersOnline);
    });

    // Catch user logout and remove user in array users online
    socket.on("userLogout", (data) => {
        usersOnline = usersOnline.filter((user) => user.userId !== data.userId);
    });

    // Catch notification
    socket.on("notification", (data) => {
        // find user receive notification
        const user = usersOnline.filter((user) => user.userId === data.userReceive)[0];
        if (user) socketIO.to(user.socketId).emit("notificationResponse", data);
        else socketIO.emit("notificationResponse", {});
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected socket.id: ${socket.id}`);
        // Remove user when user offline (disconnect)
        usersOnline = usersOnline.filter((user) => user.socketId !== socket.id);
    });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to thegioi2hand :)" });
});
app.use("/api", routers);

// handle 404 response
app.use((req: Request, res: Response, next: NextFunction) => {
    return next(new ResponseError(HttpStatusCode.NOT_FOUND, "Resource not found."));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((error: ResponseError, req: Request, res: Response, next: NextFunction) => {
    return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
    });
});

export default httpServer;
