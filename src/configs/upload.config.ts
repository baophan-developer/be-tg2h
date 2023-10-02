import { Request, Response } from "express";
import multer from "multer";
import handleUpload from "./cloudinary.config";

const storage = multer.memoryStorage();

const uploadMemories = multer({ storage });

const getDataURI = (file: Express.Multer.File | undefined): string => {
    const base64 = Buffer.from(
        file?.buffer as WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
    ).toString("base64");
    let dataURI = "data:" + file?.mimetype + ";base64," + base64;
    return dataURI;
};

const uploadHandler = async (req: Request, res: Response) => {
    try {
        const dataURI = getDataURI(req.file);
        const cldRes = await handleUpload(dataURI, "avatar");
        return cldRes;
    } catch (error: Error | any) {
        return error;
    }
};

const uploadMultipleHandler = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const imageUrls: string[] = [];

        for (const key in files) {
            let dataURI = getDataURI(files[key]);
            const imageUrl = (await handleUpload(dataURI, "products")).url;
            imageUrls.push(imageUrl);
        }
        return imageUrls;
    } catch (error) {
        return error;
    }
};

export { uploadHandler, uploadMultipleHandler, uploadMemories };
