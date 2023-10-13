import { NextFunction, Request, Response } from "express";
import OrderModel, { IOrder } from "../models/Order";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import {
    MSG_ORDER_ACCEPT_SUCCESS,
    MSG_ORDER_CANCEL,
    MSG_ORDER_CANNOT_DELIVERY_ADDRESS,
    MSG_ORDER_CANNOT_PICKUP_ADDRESS,
    MSG_ORDER_CAN_NOT_ACCEPT,
    MSG_ORDER_CAN_NOT_CANCEL,
    MSG_ORDER_CAN_NOT_CHANGE_STATUS_SHIPPING,
    MSG_ORDER_CREATE_FAILED,
    MSG_ORDER_CREATE_SUCCESS,
    MSG_ORDER_NOT_FOUND,
} from "../constants/messages";
import ProductModel from "../models/Product";
import DiscountModel from "../models/Discount";
import { Schema } from "mongoose";
import { EOrder, EStatusShipping } from "../enums/order.enum";

interface IOderFiler {
    filter: {
        owner: Schema.Types.ObjectId;
        seller: Schema.Types.ObjectId;
    };
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filter } = req.body as IOderFiler;

        const orders = await OrderModel.find(filter)
            .populate("seller", "name avatar")
            .populate("shipping", "name avatar")
            .populate("payment", "name avatar")
            .populate("items.product", "name images price")
            .populate("items.discount", "code percent")
            .exec();

        return res.json({ list: orders });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const calculatorOrderPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { items } = req.body as IOrder;

        let totalPayment = 0;

        async function main() {
            await Promise.all(
                items.map(async function (item) {
                    const product = await ProductModel.findById(item.product);
                    const discount = await DiscountModel.findById(item.discount);

                    let price = product?.price;

                    if (product) {
                        if (discount) {
                            price =
                                product?.price -
                                (product?.price / 100) * discount.percent;
                            totalPayment += price * item.quantity;
                        } else {
                            totalPayment += product.price * item.quantity;
                            price = product.price * item.quantity;
                        }
                    }

                    return {
                        product: item.product,
                        discount: item.discount,
                        quantity: item.quantity,
                        price: price,
                    };
                })
            );
        }
        await main();

        return res.json({
            item: {
                items: items,
                totalPayment: totalPayment,
            },
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);
        const {
            seller,
            shipping,
            payment,
            items,
            statusPayment,
            totalPayment,
            deliveryAddress,
        } = req.body as IOrder;

        if (!deliveryAddress)
            throw new ResponseError(400, MSG_ORDER_CANNOT_DELIVERY_ADDRESS);

        const order = await OrderModel.create({
            owner: userId,
            seller: seller,
            shipping: shipping,
            payment: payment,
            items: items,
            statusPayment: statusPayment,
            totalPayment: totalPayment,
            deliveryAddress: deliveryAddress,
        });

        if (!order) throw new ResponseError(400, MSG_ORDER_CREATE_FAILED);

        // Decrease discount have in order
        items.forEach(async (item) => {
            await DiscountModel.findByIdAndUpdate(item.discount, {
                $inc: { amount: -1 },
            });
        });

        return res.json({ message: MSG_ORDER_CREATE_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, reasonCancel } = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) throw new ResponseError(404, MSG_ORDER_NOT_FOUND);

        if (order.status === true) throw new ResponseError(400, MSG_ORDER_CAN_NOT_CANCEL);

        await OrderModel.findByIdAndUpdate(orderId, {
            $set: {
                statusOrder: EOrder.CANCEL,
                reasonCancel: reasonCancel,
            },
        });

        return res.json({ message: MSG_ORDER_CANCEL });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, pickupAddress } = req.body;

        const order = await OrderModel.findById(orderId).exec();

        if (!order) throw new ResponseError(404, MSG_ORDER_NOT_FOUND);

        if (!pickupAddress) throw new ResponseError(400, MSG_ORDER_CANNOT_PICKUP_ADDRESS);

        if (order.statusOrder === EOrder.CANCEL)
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_ACCEPT);

        await OrderModel.findByIdAndUpdate(
            orderId,
            {
                $set: { status: true, statusShipping: EStatusShipping.PREPARING },
            },
            { new: true, runValidators: true }
        );

        return res.json({ message: MSG_ORDER_ACCEPT_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

/** Temporary use */
export const changeStatusShipping = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId, status } = req.body;

        const order = await OrderModel.findById(orderId).exec();

        if (order?.status === false)
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_CHANGE_STATUS_SHIPPING);

        await OrderModel.findByIdAndUpdate(
            orderId,
            {
                $set: { statusShipping: status },
            },
            { new: true, runValidators: true }
        );
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

/** Temporary use */
export const changeStatusPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId } = req.body;

        const order = await OrderModel.findById(orderId).exec();

        if (order?.status === false)
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_CHANGE_STATUS_SHIPPING);

        await OrderModel.findByIdAndUpdate(
            orderId,
            {
                $set: { statusPayment: true },
            },
            { new: true, runValidators: true }
        );
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
