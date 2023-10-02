import { Schema } from "mongoose";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";
import ProductModel, { IProduct } from "../models/Product";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import { uploadMultipleHandler } from "../configs/upload.config";
import { MSG_CREATE_PRODUCT_SUCCESS } from "../constants/messages";

interface IFilterProduct {
    owner: Schema.Types.ObjectId;
    name: String;
    price: {
        /** lte: less than or equal */
        lte: number;
        /** gte: greater than or equal */
        gte: number;
    };
    newness: number;
    screen: {
        sizeScreen: Schema.Types.ObjectId;
        scanFrequencyScreen: Schema.Types.ObjectId;
        resolutionScreen: Schema.Types.ObjectId;
    };
    ram: {
        typeRam: Schema.Types.ObjectId;
        capacityRam: Schema.Types.ObjectId;
    };
    rom: {
        typeRom: Schema.Types.ObjectId;
        capacityRom: Schema.Types.ObjectId;
    };
    gpu: Schema.Types.ObjectId;
    cpu: Schema.Types.ObjectId;
    os: Schema.Types.ObjectId;
    brand: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId;
    approve: boolean;
    status: boolean;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {} = req.body as {};
        const products = await ProductModel.find({});
        return res.json({ list: products });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productInfo = req.body as IProduct;
        const { userId } = decodeToken(req);

        const product = await ProductModel.create({ ...productInfo, owner: userId });

        const images = await uploadMultipleHandler(req, res);

        await ProductModel.findByIdAndUpdate(product._id, { $set: { images: images } });

        return res.json({ message: MSG_CREATE_PRODUCT_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};
