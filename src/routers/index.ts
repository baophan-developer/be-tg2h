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
import branchRouters from "./branch.routers";
import categoryRouters from "./category.routers";
import osRouters from "./os.routers";
import cpuRouters from "./cpu.routers";

const routers = express();

routers.use("/auth", authRouters);
routers.use("/profile", verifyToken, profileRouters);
// ?product
// Screen
routers.use("/size-screen", verifyToken, sizeScreenRouters);
routers.use("/scan-frequency-screen", verifyToken, scanFrequencyScreenRouters);
// Ram
routers.use("/capacity-ram", verifyToken, capacityRamRouters);
routers.use("/type-ram", verifyToken, typeRamRouters);
// Rom
routers.use("/capacity-rom", verifyToken, capacityRomRouters);
routers.use("/type-rom", verifyToken, typeRomRouters);
// Gpu
routers.use("/gpu", verifyToken, gpuRouters);
// Branch
routers.use("/branch", verifyToken, branchRouters);
// Category
routers.use("/category", verifyToken, categoryRouters);
// OS
routers.use("/os", verifyToken, osRouters);
// Cpu
routers.use("/cpu", verifyToken, cpuRouters);

export default routers;
