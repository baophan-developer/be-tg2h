import { NextFunction, Request, Response } from "express";
import OrderModel from "../models/Order";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import {
    MSG_ORDER_ACCEPT_SUCCESS,
    MSG_ORDER_CANCEL,
    MSG_ORDER_CANNOT_DELIVERY_ADDRESS,
    MSG_ORDER_CAN_NOT_ACCEPT,
    MSG_ORDER_CAN_NOT_CANCEL,
    MSG_ORDER_CREATE_FAILED,
    MSG_ORDER_CREATE_SUCCESS,
    MSG_ORDER_NOT_FOUND,
    MSG_ORDER_REQUEST_REFUND,
} from "../constants/messages";
import ProductModel, { IProduct } from "../models/Product";
import DiscountModel, { IDiscount } from "../models/Discount";
import { Schema } from "mongoose";
import { EOrder, EStatusShipping } from "../enums/order.enum";
import SessionCartModel from "../models/SessionCart";
import BoughtModel, { IBought } from "../models/Bought";
import createCodeOrder from "../utils/create-code-order";
import { calculateReferencePriceForUser } from "../utils/recommendation";
import UserModel from "../models/User";
import AccountingModel from "../models/Account";

interface IOderFiler {
    filter: {
        owner: Schema.Types.ObjectId;
        seller: Schema.Types.ObjectId;
    };
    pagination: {
        page: number;
        limit: number;
    };
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filter, pagination } = req.body as IOderFiler;

        const defaultPage = 0;
        const defaultLimit = 10;

        const limit = pagination?.limit || defaultLimit;
        const skip = pagination?.page * pagination?.limit || defaultPage;

        const count = await OrderModel.find(filter).count();

        const orders = await OrderModel.find(filter, null, {
            skip: skip,
            limit: limit,
        })
            .populate("seller", "name avatar")
            .populate("owner", "name avatar")
            .populate("shipping", "name avatar")
            .populate("payment", "name avatar")
            .populate("items.product", "name images price")
            .exec();

        return res.json({
            list: orders,
            total: count,
            page: pagination?.page || defaultPage,
            limit: pagination?.limit || defaultLimit,
        });
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

        // create code order
        const count = await OrderModel.find().count();
        const code = createCodeOrder(count);

        const order = await OrderModel.create({
            code: code,
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
        const { id, reasonCancel } = req.body;

        const order = await OrderModel.findById(id);

        if (!order) throw new ResponseError(404, MSG_ORDER_NOT_FOUND);

        if (!(order.statusOrder === EOrder.ORDERED))
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_CANCEL);

        if (order.statusPayment) {
            await OrderModel.findByIdAndUpdate(id, {
                $set: {
                    statusOrder: EOrder.CANCEL,
                    statusShipping: EStatusShipping.CANCEL,
                    reasonCancel: reasonCancel,
                    refund: true,
                },
            });
            return res.json({ message: MSG_ORDER_CANCEL });
        }

        await OrderModel.findByIdAndUpdate(id, {
            $set: {
                statusOrder: EOrder.CANCEL,
                statusShipping: EStatusShipping.CANCEL,
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
        const { userId } = decodeToken(req);

        const order = await OrderModel.findById(orderId).exec();

        if (!order) throw new ResponseError(404, MSG_ORDER_NOT_FOUND);

        if (order.statusOrder === EOrder.CANCEL)
            throw new ResponseError(400, MSG_ORDER_CAN_NOT_ACCEPT);

        // update account for seller
        if (order.statusPayment === true) {
            const account = await AccountingModel.find({ owner: userId });
            const sellerAccount = account[0];
            if (sellerAccount) {
                // update
                await AccountingModel.findByIdAndUpdate(
                    sellerAccount._id,
                    {
                        $set: {
                            accountBalance:
                                sellerAccount.accountBalance + order.totalPayment,
                        },
                    },
                    { new: true }
                );
            } else {
                // create
                await AccountingModel.create({
                    owner: userId,
                    accountBalance: order.totalPayment,
                });
            }
        }

        await OrderModel.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    statusShipping: EStatusShipping.PREPARING,
                    statusOrder: EOrder.DELIVERING,
                },
            },
            { new: true, runValidators: true }
        );

        return res.json({ message: MSG_ORDER_ACCEPT_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const refundOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.body;

        await OrderModel.findByIdAndUpdate(orderId, {
            $set: {
                refund: true,
            },
        });
        return res.json({ message: "Hoàn tiền thành công." });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

/** Temporary use */
const saveReferencePriceForUser = async (boughtId: Schema.Types.ObjectId) => {
    const newBought = await BoughtModel.findById(boughtId).populate("products");

    if (!newBought)
        throw new ResponseError(
            404,
            "Lỗi, không tìm thấy danh sách sản phẩm đã mua trước đó"
        );

    const products = newBought.products;
    const referencePrice: any = calculateReferencePriceForUser(products);
    const userId = newBought.owner;
    await UserModel.findByIdAndUpdate(
        userId,
        {
            $set: {
                referencePrice: referencePrice,
            },
        },
        { new: true }
    );
};

export const changeStatusShipping = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { orderId, shipping } = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) throw new ResponseError(404, "Không tìm thấy đơn hàng.");

        if (order.statusOrder !== EOrder.DELIVERING)
            throw new ResponseError(400, "Không thể cập nhật trạng thái vận chuyển.");

        const statusShipping = [
            EStatusShipping.CANCEL,
            EStatusShipping.DELIVERED,
            EStatusShipping.DELIVERING,
            EStatusShipping.DELIVER_RECEIVE_ITEM,
            EStatusShipping.IN_STORE,
            EStatusShipping.PENDING,
            EStatusShipping.PREPARING,
        ];

        if (!statusShipping.includes(shipping))
            throw new ResponseError(404, "Trạng thái vận chuyển không đúng.");

        if (shipping === EStatusShipping.DELIVERED) {
            // update payment is true and order status is finish
            const today = new Date();
            await OrderModel.findByIdAndUpdate(orderId, {
                $set: {
                    statusOrder: EOrder.FINISH,
                    statusPayment: true,
                    statusShipping: shipping,
                    dayReceiveOrder: today,
                },
            });

            // Add product in bought of owner order
            const findBought = await BoughtModel.find({ owner: order.owner });

            const bought = findBought[0];

            /** items of order using for check duplicate product */
            const items = order.items.map((item) => item.product);

            if (bought) {
                /** newItems using add into array products of bought product */
                const newItems: Schema.Types.ObjectId[] = [];

                items.forEach((item) => {
                    const checkDuplicateProduct = bought.products.findIndex(
                        (proId) => proId.toString() === item.toString()
                    );
                    if (checkDuplicateProduct === -1) newItems.push(item);
                });

                await BoughtModel.findByIdAndUpdate(
                    bought._id,
                    {
                        $push: { products: { $each: newItems } },
                    },
                    { new: true }
                );
                // calculate reference price product to user
                await saveReferencePriceForUser(bought._id);
            } else {
                const bought = await BoughtModel.create({
                    owner: order.owner,
                    products: items,
                });
                // calculate reference price product to user
                await saveReferencePriceForUser(bought._id);
            }
            // Increase sold product in items
            order.items.forEach(async (item: any) => {
                await ProductModel.findByIdAndUpdate(item.product, {
                    $inc: { sold: item.quantity, quantity: -item.quantity },
                }).exec();
            });
        } else {
            await OrderModel.findByIdAndUpdate(orderId, {
                $set: {
                    statusShipping: shipping,
                },
            });
        }
        return res.json({ message: "Cập nhật trạng thái vận chuyển thành công." });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
