import express from "express";
import authRouters from "./auth.routers";
import profileRouters from "./profile.routers";
import verifyToken from "../middlewares/verify-token";
import sizeScreenRouters from "./size-screen.routers";
import verifyAdmin from "../middlewares/verify-admin";
import scanFrequencyScreenRouters from "./scan-frequency-screen.routers";
import capacityRamRouters from "./capacity-ram.routers";
import typeRamRouters from "./type-ram.routers";
import typeRomRouters from "./type-rom.routers";
import capacityRomRouters from "./capacity-rom.routers";
import gpuRouters from "./gpu.routers";
import brandRouters from "./brand.routers";
import categoryRouters from "./category.routers";
import osRouters from "./os.routers";
import cpuRouters from "./cpu.routers";
import resolutionScreenRouters from "./resolution-screen.routers";
import productRouters from "./product.router";
import userRouters from "./user.router";

const routers = express();

routers.use("/auth", authRouters);
routers.use("/profile", verifyToken, profileRouters);
// Screen
routers.use("/size-screen", verifyToken, sizeScreenRouters);
routers.use("/scan-frequency-screen", verifyToken, scanFrequencyScreenRouters);
routers.use("/resolution-screen", verifyToken, resolutionScreenRouters);
// Ram
routers.use("/capacity-ram", verifyToken, capacityRamRouters);
routers.use("/type-ram", verifyToken, typeRamRouters);
// Rom
routers.use("/capacity-rom", verifyToken, capacityRomRouters);
routers.use("/type-rom", verifyToken, typeRomRouters);
// Gpu
routers.use("/gpu", verifyToken, gpuRouters);
// Branch
routers.use("/brand", verifyToken, brandRouters);
// Category
routers.use("/category", verifyToken, categoryRouters);
// OS
routers.use("/os", verifyToken, osRouters);
// Cpu
routers.use("/cpu", verifyToken, cpuRouters);
// Product
routers.use("/product", verifyToken, productRouters);
// User
routers.use("/user", verifyToken, verifyAdmin, userRouters);

export default routers;
