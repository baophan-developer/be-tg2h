import { NextFunction, Request, Response } from "express";
import OrderModel, { IOrder } from "../models/Order";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import {
    MSG_ORDER_ACCEPT_SUCCESS,
    MSG_ORDER_CANCEL,
    MSG_ORDER_CANNOT_DELIVERY_ADDRESS,
    MSG_ORDER_CAN_NOT_ACCEPT,
    MSG_ORDER_CAN_NOT_CANCEL,
    MSG_ORDER_CAN_NOT_CHANGE_STATUS_SHIPPING,
    MSG_ORDER_CREATE_FAILED,
    MSG_ORDER_CREATE_SUCCESS,
    MSG_ORDER_NOT_FOUND,
} from "../constants/messages";
import ProductModel, { IProduct } from "../models/Product";
import DiscountModel, { IDiscount } from "../models/Discount";
import { Schema } from "mongoose";
import { EOrder, EStatusShipping } from "../enums/order.enum";
import SessionCartModel from "../models/SessionCart";

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

interface ICalculatorOrder {
    product: IProduct;
    discount: IDiscount | undefined;
    quantity: number;
}

export const calculatorOrderPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { items } = req.body as { items: ICalculatorOrder[] };

        let totalPayment = 0;

        /** new items using for render order in fe */
        const newItems = items.map((item) => {
            let price: number = 0;

            if (item.discount) {
                price =
                    (item.product.price -
                        (item.product.price / 100) * item.discount.percent) *
                    item.quantity;

                totalPayment += price;
            }

            if (!item.discount) {
                price = item.product.price * item.quantity;
                totalPayment += price;
            }

            return {
                product: item.product,
                discount: item.discount,
                quantity: item.quantity,
                price: price,
            };
        });

        return res.json({
            items: newItems,
            totalPayment: totalPayment,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);
        const {
            cartId,
            seller,
            shipping,
            payment,
            items,
            statusPayment,
            totalPayment,
            deliveryAddress,
            pickupAddress,
        } = req.body as any;

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
            pickupAddress: pickupAddress,
        });

        if (!order) throw new ResponseError(400, MSG_ORDER_CREATE_FAILED);

        // remove cart
        await SessionCartModel.findByIdAndDelete(cartId);

        // Decrease discount have in order
        items.forEach(async (item: any) => {
            await DiscountModel.findByIdAndUpdate(item.discount?._id, {
                $inc: { amount: -1 },
            }).exec();
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
        const { orderId } = req.body;

        const order = await OrderModel.findById(orderId).exec();

        if (!order) throw new ResponseError(404, MSG_ORDER_NOT_FOUND);

        if (order.statusOrder === EOrder.CANCEL)
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_ACCEPT);

        await OrderModel.findByIdAndUpdate(
            orderId,
            {
                $set: { status: true, statusShipping: EStatusShipping.PREPARING },
            },
            { new: true, runValidators: true }
        );

        // Increase sold product in items
        order.items.forEach(async (item: any) => {
            await ProductModel.findByIdAndUpdate(item.product, {
                $inc: { sold: item.quantity },
            }).exec();
        });

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
