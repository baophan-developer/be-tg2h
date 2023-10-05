import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";
import handleError from "../utils/handle-error";
import decodeToken from "../utils/decode-token";
import ProductModel, { IProduct } from "../models/Product";
import { uploadMultipleHandler } from "../configs/upload.config";
import {
    MSG_APPROVE_PRODUCT_SUCCESS,
    MSG_CREATE_PRODUCT_SUCCESS,
    MSG_ERROR_ACCOUNT_NOT_EXISTED,
    MSG_ERROR_YOU_ARE_NOT_OWNER,
    MSG_PRODUCT_NOT_FOUND,
    MSG_REJECT_PRODUCT_SUCCESS,
    MSG_UPDATE_PRODUCT_FAILED,
    MSG_UPDATE_PRODUCT_SUCCESS,
} from "../constants/messages";
import UserModel from "../models/User";
import transporter from "../configs/mail.config";

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
        const product = req.body as IProduct;

        const { userId } = decodeToken(req);

        const userUpdateId = userId as unknown;
        const owner = product.owner as unknown;

        if (userUpdateId !== owner)
            throw new ResponseError(400, MSG_ERROR_YOU_ARE_NOT_OWNER);

        const images = (await uploadMultipleHandler(req, res)) as [];

        if (images && images?.length === 0)
            throw new ResponseError(400, "Không thể upload hình ảnh");

        console.log(images);

        const update = await ProductModel.findByIdAndUpdate(
            product.id,
            {
                $set: { ...product },
                $push: { images: { $each: images } },
            },
            { new: true, runValidators: true }
        );
        if (!update) throw new ResponseError(400, MSG_UPDATE_PRODUCT_FAILED);

        return res.json({ message: MSG_UPDATE_PRODUCT_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const approveProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        await ProductModel.findByIdAndUpdate(
            id,
            { $set: { approve: true } },
            { new: true }
        );
        return res.json({ message: MSG_APPROVE_PRODUCT_SUCCESS });
    } catch (error) {}
};

export const rejectProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, reason } = req.body;

        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) throw new ResponseError(404, MSG_PRODUCT_NOT_FOUND);

        const user = await UserModel.findById(product.owner);

        if (!user) throw new ResponseError(404, MSG_ERROR_ACCOUNT_NOT_EXISTED);

        transporter.sendMail(
            {
                to: user.email,
                subject: "Từ chối sản phẩm!",
                text: reason,
            },
            function (err) {
                if (err) return next(new ResponseError(500));
                transporter.close();
            }
        );
        return res.json({ message: MSG_REJECT_PRODUCT_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
