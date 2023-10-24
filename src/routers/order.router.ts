import express, { Router } from "express";
import {
    acceptOrder,
    calculatorOrderPayment,
    cancelOrder,
    changeStatusPayment,
    changeStatusShipping,
    createOrder,
    getOrders,
    refundOrder,
} from "../controllers/order.controller";

const orderRouters: Router = express.Router();

orderRouters.post("/", getOrders);
orderRouters.post("/create-order", createOrder);
orderRouters.post("/calculator-payment", calculatorOrderPayment);
orderRouters.post("/cancel-order", cancelOrder);
orderRouters.post("/accept-order", acceptOrder);
orderRouters.post("/refund", refundOrder);

/** Temporary use */
orderRouters.post("/shipping", changeStatusShipping);
orderRouters.post("/payment", changeStatusPayment);

export default orderRouters;
