import { NextFunction, Request, Response } from "express";
import ResponseError from "../utils/error-api";
import OrderModel from "../models/Order";
import decodeToken from "../utils/decode-token";
import { EOrder } from "../enums/order.enum";

export const calculatorRevenue = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = decodeToken(req);
        const { filter } = req.body;

        const orders = await OrderModel.find({
            seller: userId,
            ...filter,
        });

        // Calculator for order paid,
        const ordersPaid = orders.filter(
            (item) =>
                item.statusPayment === true &&
                item.statusOrder !== EOrder.REQUEST_REFUND &&
                item.statusOrder !== EOrder.CANCEL
        );

        const paidTotal = ordersPaid.reduce((val, curr) => curr.totalPayment + val, 0);

        // Calculator for await payment,
        const ordersAwaitPayment = orders.filter(
            (item) => item.statusPayment === false && item.statusOrder !== EOrder.CANCEL
        );
        const paidAwait = ordersAwaitPayment.reduce(
            (val, curr) => curr.totalPayment + val,
            0
        );

        // Calculator number orders success
        const ordersSuccess = orders.filter(
            (item) => item.statusOrder === EOrder.FINISH
        ).length;

        // Calculator number orders cancel
        const ordersCancel = orders.filter(
            (item) => item.statusOrder === EOrder.CANCEL
        ).length;

        // Calculator number orders delivery
        const ordersDelivery = orders.filter(
            (item) => item.statusOrder === EOrder.DELIVERING
        ).length;

        return res.json({
            paid: paidTotal,
            awaitPayment: paidAwait,
            numberOrderSuccess: ordersSuccess,
            numberOrderCancel: ordersCancel,
            numberOrderDelivering: ordersDelivery,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
