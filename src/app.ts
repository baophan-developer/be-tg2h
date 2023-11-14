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
const io = new Server(httpServer, {
    cors: corsOptions,
});

io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`User discounted: ${socket.id}`);
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
