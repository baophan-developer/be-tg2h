import { v2 as cloudinary } from "cloudinary";
import configs from ".";

cloudinary.config({
    cloud_name: configs.cloudinary.cloudName,
    api_key: configs.cloudinary.apiKey,
    api_secret: configs.cloudinary.apiSecret,
});

const handleUpload = async (file: string, folder?: string) => {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder: folder,
    });
    return res;
};

export default handleUpload;
