import express, { Router } from "express";
import {
    createComment,
    deleteComment,
    getComment,
} from "../controllers/comment.controller";

const commentRouters: Router = express.Router();

commentRouters.post("/", getComment);
commentRouters.post("/add", createComment);
commentRouters.delete("/", deleteComment);

export default commentRouters;
