import express, { Router } from "express";
import {
    forgotPassword,
    login,
    logout,
    refreshToken,
    register,
    resetPassword,
} from "../controllers/auth.controller";
import checkDuplicateEmail from "../middlewares/check-duplicate-email";
import validateLogin from "../middlewares/validate-login";
import verifyToken from "../middlewares/verify-token";
import checkAdminLogin from "../middlewares/check-admin-login";

const authRouters: Router = express.Router();

authRouters.post("/register", checkDuplicateEmail, register);
authRouters.post("/login", validateLogin, login);
authRouters.post("/admin-login", checkAdminLogin, login);
authRouters.post("/logout", verifyToken, logout);
authRouters.post("/refresh-token", refreshToken);
authRouters.post("/forgot-password", forgotPassword);
authRouters.post("/reset-password", resetPassword);

export default authRouters;
