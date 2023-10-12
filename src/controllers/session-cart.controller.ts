import { NextFunction, Request, Response } from "express";
import SessionCartModel from "../models/SessionCart";
import {
    MSG_ERROR_OWNER_CART,
    MSG_SESSION_CART_ADD_SUCCESS,
    MSG_SESSION_CART_REMOVE_SUCCESS,
} from "../constants/messages";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";

interface IAddProductToCart {
    ownerProducts: string;
    product: string;
}

export const addProductToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ownerProducts, product } = req.body as IAddProductToCart;
        const { userId } = decodeToken(req);

        if (ownerProducts === userId?.toString())
            throw new ResponseError(400, MSG_ERROR_OWNER_CART);

        const sessionCarts = await SessionCartModel.findOne({
            ownerCart: userId,
            ownerProducts: ownerProducts,
        });

        if (!sessionCarts) {
            await SessionCartModel.create({
                ownerCart: userId,
                ownerProducts: ownerProducts,
                items: [{ product: product, quantity: 1 }],
            });
            return res.json({ message: MSG_SESSION_CART_ADD_SUCCESS });
        }

        const productInItems = await SessionCartModel.findOne({
            _id: sessionCarts._id,
            "items.product": product,
        });

        if (!productInItems) {
            await SessionCartModel.findByIdAndUpdate(
                sessionCarts._id,
                {
                    $push: {
                        items: {
                            product: product,
                            quantity: 1,
                        },
                    },
                },
                { new: true }
            ).exec();
            return res.json({ message: MSG_SESSION_CART_ADD_SUCCESS });
        }

        const items = productInItems.items.map((item) => {
            if (item.product.toString() === product) {
                return {
                    product: item.product,
                    quantity: item.quantity + 1,
                };
            }
            return item;
        });

        await SessionCartModel.findByIdAndUpdate(
            sessionCarts._id,
            {
                $set: { items: items },
            },
            { new: true }
        );

        return res.json({ message: MSG_SESSION_CART_ADD_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const removeProductInCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ownerProducts, product } = req.body as IAddProductToCart;
        const { userId } = decodeToken(req);

        const sessionCart = await SessionCartModel.findOne({
            ownerCart: userId,
            ownerProducts: ownerProducts,
        });

        const items = sessionCart?.items.filter(
            (item) => item.product.toString() !== product
        );

        if (items?.length === 0) {
            await SessionCartModel.findByIdAndDelete(sessionCart?._id);
            return res.json({ message: MSG_SESSION_CART_REMOVE_SUCCESS });
        }

        await SessionCartModel.findByIdAndUpdate(
            sessionCart?._id,
            {
                $set: {
                    items: items,
                },
            },
            { new: true }
        );

        return res.json({ message: MSG_SESSION_CART_REMOVE_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const decreaseProductInCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ownerProducts, product } = req.body as IAddProductToCart;
        const { userId } = decodeToken(req);

        const sessionCart = await SessionCartModel.findOne({
            ownerCart: userId,
            ownerProducts: ownerProducts,
        });

        const items = sessionCart?.items.map((item) => {
            if (item.product.toString() === product) {
                return {
                    product: item.product,
                    quantity: item.quantity - 1,
                };
            }
            return item;
        });

        const filterQuantityZero = items?.filter((item) => item.quantity !== 0);

        if (filterQuantityZero?.length === 0) {
            await SessionCartModel.findByIdAndDelete(sessionCart?._id);
            return res.json({ message: MSG_SESSION_CART_REMOVE_SUCCESS });
        }

        await SessionCartModel.findByIdAndUpdate(
            sessionCart?._id,
            {
                $set: {
                    items: filterQuantityZero,
                },
            },
            { new: true }
        );

        return res.json({ message: "" });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);
        const cart = await SessionCartModel.find({ ownerCart: userId })
            .populate("ownerProducts", "_id name avatar")
            .populate("items.product", "_id name images price newness")
            .exec();

        let totalProductCart: number = 0;

        cart.forEach((item) => (totalProductCart += item.items.length));

        return res.json({ item: { list: cart, total: totalProductCart } });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
