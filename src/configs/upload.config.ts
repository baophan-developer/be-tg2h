import { Request, Response } from "express";
import multer from "multer";
import handleUpload from "./cloudinary.config";

const storage = multer.memoryStorage();

const uploadMemories = multer({ storage });

const uploadHandler = async (req: Request, res: Response) => {
    try {
        const base64 = Buffer.from(
            req.file?.buffer as WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>
        ).toString("base64");
        let dataURI = "data:" + req.file?.mimetype + ";base64," + base64;
        const cldRes = await handleUpload(dataURI);
        return cldRes;
    } catch (error: Error | any) {
        return error;
    }
};

export { uploadHandler, uploadMemories };
