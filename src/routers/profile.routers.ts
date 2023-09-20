import express, { Router } from "express";
import { uploadMemories } from "../configs/upload.config";
import {
    addAddressUser,
    getProfile,
    updateAvatar,
    updateProfile,
} from "../controllers/profile.controller";

const profileRouters: Router = express.Router();

profileRouters.get("/", getProfile);
profileRouters.put("/update-profile", updateProfile);
profileRouters.put("/update-avatar", uploadMemories.single("avatar"), updateAvatar);
profileRouters.put("/update-address", addAddressUser);

export default profileRouters;
