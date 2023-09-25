import express, { Router } from "express";
import { uploadMemories } from "../configs/upload.config";
import {
    addAddressUser,
    editAddressUser,
    getProfile,
    removeAddressUser,
    updateAvatar,
    updateProfile,
} from "../controllers/profile.controller";

const profileRouters: Router = express.Router();

profileRouters.get("/", getProfile);
profileRouters.put("/update-profile", updateProfile);
profileRouters.put("/update-avatar", uploadMemories.single("avatar"), updateAvatar);
profileRouters.post("/create-address", addAddressUser);
profileRouters.put("/update-address", editAddressUser);
profileRouters.delete("/delete-address", removeAddressUser);

export default profileRouters;
