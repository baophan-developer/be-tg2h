import { Schema, model } from "mongoose";

export interface IAdress {
    provinceId: number;
    districtId: number;
    wardId: number;
    street: String;
    address: string;
}

const addressSchema = new Schema<IAdress>({
    provinceId: { type: Number, required: [true, "Tỉnh/thành phố là bắt buộc."] },
    districtId: { type: Number, required: [true, "Quận/huyện là bắt buộc."] },
    wardId: { type: Number, required: [true, "Xã/phường là bắt buộc."] },
    street: { type: String, default: "" },
    address: { type: String, default: "" },
});

const AddressModel = model<IAdress>("Address", addressSchema);

export default AddressModel;
