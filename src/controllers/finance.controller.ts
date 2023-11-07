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

        const ordersCancel = orders.filter((item) => item.statusOrder === EOrder.CANCEL);

        const ordersSuccess = orders.filter((item) => item.statusOrder === EOrder.FINISH);

        const ordersPaid = orders.filter((item) => item.statusPayment === true);

        const orderDelivering = orders.filter(
            (item) => item.statusOrder === EOrder.DELIVERING
        );

        const paid = ordersPaid.reduce((value, curr) => curr.totalPayment + value, 0);

        const ordersAwaitPayment = orders.filter((item) => item.statusPayment === false);

        const awaitPayment = ordersAwaitPayment.reduce(
            (value, curr) => curr.totalPayment + value,
            0
        );

        return res.json({
            paid: paid,
            awaitPayment: awaitPayment,
            numberOrderSuccess: ordersSuccess.length,
            numberOrderCancel: ordersCancel.length,
            numberOrderDelivering: orderDelivering.length,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
