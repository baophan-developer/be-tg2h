import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import ProductModel, { IProduct } from "../models/Product";
import { uploadMultipleHandler } from "../configs/upload.config";
import { MSG_CREATE_PRODUCT_SUCCESS } from "../constants/messages";

interface IQueryProduct {
    filters: any;
    pagination: {
        page: number;
        limit: number;
    };
    /** Only sort on two attribute is approve and price */
    sort: any;
}

const removeAttributePopulated = "-__v -createdAt -updatedAt";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filters, pagination, sort } = req.body as IQueryProduct;

        const defaultPage = 0;
        const defaultLimit = 10;

        const limit = pagination?.limit || defaultLimit;
        const skip = pagination?.page * pagination?.limit || defaultPage;

        const products = await ProductModel.find(filters, null, {
            skip: skip,
            limit: limit,
            sort,
        })
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
            .populate("brand", removeAttributePopulated)
            .exec();

        return res.json({
            list: products,
            total: products.length,
            page: pagination.page || defaultPage,
            limit: pagination.limit || defaultLimit,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getDetailProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id)
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
        return res.json({ item: product });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productInfo = req.body as IProduct;
        const { userId } = decodeToken(req);
        const images = (await uploadMultipleHandler(req, res)) as [];

        if (images && images?.length === 0)
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

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {} = req.body as IProduct;
    } catch (error) {}
};

export const approveProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        await ProductModel.findByIdAndUpdate(
            id,
            { $set: { approve: true } },
            { new: true }
        );
    } catch (error) {}
};

export const rejectProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // delete product and reason reject
    } catch (error) {}
};
