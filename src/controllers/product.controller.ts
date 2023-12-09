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
import { destroyFile } from "../configs/cloudinary.config";
import getPublicIdFile from "../utils/get-public-id";
import { IDiscount } from "../models/Discount";
import NotificationModel from "../models/Notification";
import configs from "../configs";
import templateMail from "../template/mail";

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

        const count = await ProductModel.find(filters).count();

        const products = await ProductModel.find(filters, null, {
            skip: skip,
            limit: limit,
            sort,
        })
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
            .populate("discount", removeAttributePopulated)
            .exec();

        return res.json({
            list: products,
            total: count,
            page: pagination?.page || defaultPage,
            limit: pagination?.limit || defaultLimit,
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
            .populate("discount", removeAttributePopulated)
            .exec();
        return res.json({ item: product });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productInfo = req.body as IProduct;
        const { userId } = decodeToken(req);
        const user = await UserModel.findById(userId);

        if (!user) throw new ResponseError(400, "Không thể thêm sản phẩm.");

        if (user.address.length === 0)
            throw new ResponseError(
                400,
                "Bạn phải có ít nhất một địa chỉ làm địa chỉ chính cho người giao hàng nhận hàng."
            );

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

        if (!images) throw new ResponseError(400, "Không thể upload hình ảnh");

        const update = await ProductModel.findByIdAndUpdate(
            product.id,
            {
                $set: { ...product },
            },
            { new: true, runValidators: true }
        );

        await ProductModel.findByIdAndUpdate(
            update?._id,
            {
                $push: { images: { $each: images } },
            },
            { new: true }
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
        const { userId } = decodeToken(req);

        const user = await UserModel.findById(userId).exec();

        const product = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { approve: true, status: true } },
            { new: true }
        );

        if (!product) throw new ResponseError(422, "Không thể duyệt sản phẩm.");

        const receiver = await UserModel.findById(product.owner).exec();

        const url = `${configs.client.user}/account/products/${product._id}`;

        // create notification
        await NotificationModel.create({
            userReceive: receiver?._id,
            title: "Sản phẩm đã được duyệt",
            message: `Sản phẩm ${product.name} đã được duyệt bởi ${user?.name}`,
            action: url,
        });

        transporter.sendMail(
            {
                to: receiver?.email,
                subject: "Thông báo duyệt sản phẩm - laptop2hand",
                html: templateMail(
                    "Sản phẩm của bạn đã được duyệt.",
                    `Sản phẩm ${product.name} đã được duyệt bởi ${user?.name}, giờ đây sản phẩm của bạn đã có thể đưa lên kệ. Nhấn vào đường dẫn sau để có thể quản lý sản phẩm của bạn`,
                    "Quản lý sản phẩm",
                    url
                ),
            },
            function (err) {
                if (err) return next(new ResponseError(500));
                transporter.close();
                return res.json({ message: MSG_APPROVE_PRODUCT_SUCCESS });
            }
        );
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const rejectProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, reason } = req.body;
        const { userId } = decodeToken(req);

        const user = await UserModel.findById(userId).exec();
        if (!user) throw new ResponseError(404, MSG_ERROR_ACCOUNT_NOT_EXISTED);

        const product = await ProductModel.findById(id);

        if (!product) throw new ResponseError(404, MSG_PRODUCT_NOT_FOUND);

        const images = product.images;

        images.forEach(async (item) => {
            const publicId = getPublicIdFile(item);
            await destroyFile(publicId, "products");
        });

        // create notification
        const receiver = await UserModel.findById(product.owner).exec();

        if (!receiver) throw new ResponseError(404, MSG_ERROR_ACCOUNT_NOT_EXISTED);

        const url = `${configs.client.user}/account/products`;

        // create notification
        await NotificationModel.create({
            userReceive: receiver?._id,
            title: "Sản phẩm của bạn",
            message: `Sản phẩm ${product.name} đã bị từ chối bởi ${user?.name}`,
            action: url,
        });

        await ProductModel.findByIdAndDelete(product.id);

        transporter.sendMail(
            {
                to: receiver?.email,
                subject: "Thông báo duyệt sản phẩm - laptop2hand",
                html: templateMail(
                    "Sản phẩm của bạn đã bị từ chối",
                    `Sản phẩm ${product.name} đã bị từ chối bởi ${user?.name}. Với lý do: ${reason}. Bạn có thể thêm sản phẩm khác bằng cách nhấn vào đường dẫn bên dưới.`,
                    "Quản lý sản phẩm",
                    url
                ),
            },
            function (err) {
                if (err) return next(new ResponseError(500));
                transporter.close();
                return res.json({ message: MSG_REJECT_PRODUCT_SUCCESS });
            }
        );
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getProductsRatingHigh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductModel.find({}, null, {
            sort: { rating: -1 },
        })
            .populate("discount")
            .exec();

        const result = products.slice(0, 6);

        return res.json({ list: result });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getProductsSoldHigh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await ProductModel.find({ status: true, approve: true }, null, {
            sort: { sold: -1 },
        })
            .populate("discount")
            .exec();

        const result = products.slice(0, 6);

        return res.json({ list: result });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};

export const getTopSaleHigh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await ProductModel.find({ status: true, approve: true })
            .populate("discount")
            .exec();

        const productsHasDiscount: any = [];

        products.forEach((item: any) => {
            if (item.discount && Date.parse(item.discount.start) <= Date.now())
                productsHasDiscount.push(item);
        });

        const result = productsHasDiscount.sort(
            (a: any, b: any) => b.discount.percent - a.discount.percent
        );

        const final = result.slice(0, 5);

        return res.json({ list: final });
    } catch (error: any) {
        return next(new ResponseError(error.status, error.message));
    }
};
