import { Schema, model } from "mongoose";

export interface IAdress {
    provinceId: number;
    districtId: number;
    wardId: number;
    street: String;
    address: string;
    main: boolean;
}

const addressSchema = new Schema<IAdress>({
    provinceId: { type: Number, required: [true, "Tỉnh/thành phố là bắt buộc."] },
    districtId: { type: Number, required: [true, "Quận/huyện là bắt buộc."] },
    wardId: { type: Number, required: [true, "Xã/phường là bắt buộc."] },
    street: { type: String, default: "" },
    address: { type: String, default: "" },
    main: { type: Boolean, default: false },
});

const AddressModel = model<IAdress>("Address", addressSchema);

export default AddressModel;
