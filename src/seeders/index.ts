import mongoose from "mongoose";
import configs from "../configs";
import RoleModel from "../models/Role";

const seederRoles = async () => {
    try {
        await mongoose.connect(configs.db.url);
        console.log("[Server]: Connect database successfully!");

        await RoleModel.create({ name: "User" });
        await RoleModel.create({ name: "Admin" });

        mongoose.disconnect();
    } catch (error) {
        console.log("[Server]: Cannot connect database successfully!");
        process.exit();
    }
};

seederRoles();
