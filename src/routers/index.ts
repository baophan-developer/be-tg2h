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

const routers = express();

routers.use("/auth", authRouters);
routers.use("/profile", verifyToken, profileRouters);
// ?product
// Screen
routers.use("/size-screen", verifyToken, verifyAdmin, sizeScreenRouters);
routers.use(
    "/scan-frequency-screen",
    verifyToken,
    verifyAdmin,
    scanFrequencyScreenRouters
);
// Ram
routers.use("/capacity-ram", verifyToken, verifyAdmin, capacityRamRouters);
routers.use("/type-ram", verifyToken, verifyAdmin, typeRamRouters);
// Rom
routers.use("/type-rom", verifyToken, verifyAdmin, typeRomRouters);

export default routers;
