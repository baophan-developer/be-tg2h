import { Schema } from "mongoose";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";
import ProductModel, { IProduct } from "../models/Product";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import { uploadMultipleHandler } from "../configs/upload.config";
import { MSG_CREATE_PRODUCT_SUCCESS } from "../constants/messages";

interface IFilterProduct {}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {} = req.body as {};
        const removeAttributePopulated = "-__v -createdAt -updatedAt";
        const products = await ProductModel.find({})
            .populate("sizeScreen", removeAttributePopulated)
            .populate("scanFrequency", removeAttributePopulated)
            .populate("resolutionScreen", removeAttributePopulated)
            .populate("typeRam", removeAttributePopulated)
            .populate("capacityRam", removeAttributePopulated)
            .populate("typeRom", removeAttributePopulated)
            .populate("capacityRom", removeAttributePopulated)
            .populate("gpu", removeAttributePopulated)
            .populate("cpu", removeAttributePopulated)
            .populate("os", removeAttributePopulated)
            .populate("category", removeAttributePopulated)
            .populate("brand", removeAttributePopulated);
        return res.json({ list: products });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productInfo = req.body as IProduct;
        const { userId } = decodeToken(req);
        const images = (await uploadMultipleHandler(req, res)) as [];

        if ((images && images?.length === 0) || typeof images === "object")
            throw new ResponseError(400, "Không thể upload hình ảnh");

        await ProductModel.create({
            ...productInfo,
            images: images,
            owner: userId,
        });
        return res.json({ message: MSG_CREATE_PRODUCT_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};
