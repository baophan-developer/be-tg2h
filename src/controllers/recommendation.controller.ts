import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error-api";
import decodeToken from "../utils/decode-token";
import ProductModel from "../models/Product";
import UserModel from "../models/User";
import { calculatePriceSimilarity } from "../utils/recommendation";

interface IQueryProduct {
    pagination: {
        page: number;
        limit: number;
    };
}

const removeAttributePopulated = "-__v -createdAt -updatedAt";

export const recommendation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = decodeToken(req);
        const { pagination } = req.body as IQueryProduct;

        const defaultPage = 0;
        const defaultLimit = 20;

        const skip = pagination.page * pagination.limit || defaultPage;
        const limit =
            pagination.page * pagination.limit + pagination.limit || defaultLimit;

        const products = await ProductModel.find({ status: true, approve: true })
            .populate("owner", "name avatar phone email birthday gender")
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

        const user = await UserModel.findById(userId);

        const userPrice = user?.referencePrice || 0;

        const similarityProducts = products.map((item: any) => ({
            ...item?._doc,
            similarity: calculatePriceSimilarity(userPrice, item.price),
        }));

        const data = similarityProducts
            .sort((a, b) => b.similarity - a.similarity)
            .slice(skip, limit);

        return res.json({
            list: data,
            total: products.length,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
