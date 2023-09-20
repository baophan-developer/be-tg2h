import { Schema, model } from "mongoose";

export enum ERole {
    user = "User",
    admin = "Admin",
}

export interface IRole {
    name: string;
}

const roleSchema = new Schema<IRole>({
    name: { type: String, unique: true, required: true },
});

const RoleModel = model<IRole>("Role", roleSchema);

export default RoleModel;
