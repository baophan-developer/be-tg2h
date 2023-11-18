import { NextFunction, Request, Response } from "express";
import CommentModel, { IComment } from "../models/Comment";
import handleError from "../utils/handle-error";
import ResponseError from "../utils/error-api";
import {
    MSG_CREATE_COMMENT_FAILED,
    MSG_CREATE_COMMENT_SUCCESS,
    MSG_DELETE_COMMENT_SUCCESS,
} from "../constants/messages";
import ProductModel from "../models/Product";
import decodeToken from "../utils/decode-token";
import NotificationModel from "../models/Notification";
import UserModel from "../models/User";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { product, rating, content } = req.body as IComment;
        const { userId } = decodeToken(req);

        const user = await UserModel.findById(userId).exec();

        if (!user) throw new ResponseError(422, "Lỗi, không thể thêm đánh giá.");

        const comment = await CommentModel.create({
            user: userId,
            product: product,
            rating: rating,
            content: content,
        });

        if (!comment) throw new ResponseError(422, MSG_CREATE_COMMENT_FAILED);

        const productCalculator = await ProductModel.findById(product).exec();

        if (!productCalculator) throw new ResponseError(404, "Sản phẩm không tồn tại");

        const comments = await CommentModel.find({ product: product }).exec();

        let updateRating = 0;
        let totalRating = 0;
        comments.forEach((item) => (totalRating += item.rating));

        updateRating = totalRating / comments.length;

        await ProductModel.findByIdAndUpdate(product, {
            $inc: { reviews: +1 },
            $set: {
                rating: updateRating,
            },
        }).exec();

        // *Note user id is person comment
        if (userId.toString() !== productCalculator.owner.toString()) {
            // Create notification comment
            await NotificationModel.create({
                userReceive: productCalculator.owner,
                title: "Đánh giá sản phẩm",
                message: `${user.name}: ${content} cho sản phẩm ${productCalculator.name}`,
                action: `http://localhost:3000/products/${productCalculator._id}`,
            });
        }

        return res.json({ message: MSG_CREATE_COMMENT_SUCCESS });
    } catch (error: any) {
        const { status, message } = handleError(error);
        return next(new ResponseError(status, message));
    }
};

export const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filter, pagination } = req.body;

        const defaultPage = 0;
        const defaultLimit = 10;

        const limit = pagination?.limit || defaultLimit;
        const skip = pagination?.page * pagination?.limit || defaultPage;

        const total = await CommentModel.find(filter).count().exec();

        const comments = await CommentModel.find(filter, null, {
            skip: skip,
            limit: limit,
        })
            .populate("user", "name avatar")
            .exec();

        return res.json({
            comments: comments,
            total: total,
            page: pagination?.page || defaultPage,
            limit: pagination?.limit || defaultLimit,
        });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, productId } = req.query;

        const comment = await CommentModel.findByIdAndDelete(id).exec();

        if (!comment) throw new ResponseError(404, "Không tìm thấy đánh giá.");

        const comments = await CommentModel.find({ product: productId }).exec();

        let rating = 0;
        let totalRating = 0;

        comments.forEach((item) => (totalRating += item.rating));

        if (totalRating !== 0) rating = totalRating / comments.length;

        if (totalRating === 0) rating = 0;

        await ProductModel.findByIdAndUpdate(
            productId,
            {
                $set: { rating: rating },
                $inc: { reviews: -1 },
            },
            { new: true }
        ).exec();

        return res.json({ message: MSG_DELETE_COMMENT_SUCCESS });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
