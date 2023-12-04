import express, { Router } from "express";
import {
    acceptOrder,
    calculatorOrderPayment,
    cancelOrder,
    changeStatusShipping,
    confirmReceivedOrder,
    confirmRefundOrder,
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

// Confirm received order by buyer
orderRouters.post("/confirm-received-order", confirmReceivedOrder);

// Request refund form buyer
orderRouters.post("/refund", refundOrder);
// Confirm refund form seller
orderRouters.post("/refund-confirm", confirmRefundOrder);

/** Temporary use */
orderRouters.post("/shipping", changeStatusShipping);

export default orderRouters;
