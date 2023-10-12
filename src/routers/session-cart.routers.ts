import express, { Router } from "express";
import {
    addProductToCart,
    decreaseProductInCart,
    getMyCart,
    removeProductInCart,
} from "../controllers/session-cart.controller";

const sessionCartRouters: Router = express.Router();

sessionCartRouters.post("/add", addProductToCart);
sessionCartRouters.post("/remove", removeProductInCart);
sessionCartRouters.post("/decrease", decreaseProductInCart);
sessionCartRouters.get("/", getMyCart);

export default sessionCartRouters;
