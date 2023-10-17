import { Schema, model } from "mongoose";
import PRODUCT from "../constants/product";
import getVnd from "../utils/get-vnd";

export interface IProduct {
    id: Schema.Types.ObjectId;
    name: string;
    images: string[];
    desc: string;
    price: number;
    length: number;
    height: number;
    width: number;
    weight: number;
    betterCapacity: string;
    newness: number;
    owner: Schema.Types.ObjectId;
    sizeScreen: Schema.Types.ObjectId;
    scanFrequency: Schema.Types.ObjectId;
    resolutionScreen: Schema.Types.ObjectId;
    typeRam: Schema.Types.ObjectId;
    capacityRam: Schema.Types.ObjectId;
    typeRom: Schema.Types.ObjectId;
    capacityRom: Schema.Types.ObjectId;
    gpu: Schema.Types.ObjectId;
    cpu: Schema.Types.ObjectId;
    os: Schema.Types.ObjectId;
    brand: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId;
    discount: Schema.Types.ObjectId;
    addressPickupProduct: string;
    sold: number;
    approve: boolean;
    status: boolean;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, "Tên sản phẩm là bắt buộc."],
        minlength: [PRODUCT.NAME.MIN, `Tên sản phẩm không được ít hơn {VALUE} ký tự.`],
        maxlength: [PRODUCT.NAME.MAX, `Tên sản phẩm không được quá {VALUE} ký tự.`],
    },
    images: {
        type: [String],
        required: [true, "Chưa cung cấp hình ảnh sản phẩm."],
    },
    desc: {
        type: String,
        maxlength: [PRODUCT.DESC.MAX, "Mô tả chỉ được phép tối đa {VALUE} ký tự."],
        default: "",
    },
    price: {
        type: Number,
        required: [true, "Giá thành sản phẩm là bắt buộc."],
        min: [
            PRODUCT.PRICE.MIN,
            `Giá thành sản phẩm ít nhất là ${getVnd(PRODUCT.PRICE.MIN)} vnd.`,
        ],
        max: [
            PRODUCT.PRICE.MAX,
            `Giá thành sản phẩm cao nhất là ${getVnd(PRODUCT.PRICE.MAX)} vnd.`,
        ],
    },
    length: {
        type: Number,
        required: [true, "Chiều dài của sản phẩm là bắt buộc."],
    },
    height: {
        type: Number,
        required: [true, "Độ dài của sản phẩm là bắt buộc."],
    },
    width: {
        type: Number,
        required: [true, "Độ rộng của sản phẩm là bắt buộc."],
    },
    weight: {
        type: Number,
        required: [true, "Cân nặng của sản phẩm là bắt buộc."],
    },
    betterCapacity: {
        type: String,
    },
    newness: {
        type: Number,
        required: [true, "Độ mới của sản phẩm là bắt buộc."],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sản phẩm phải có người sở hữu."],
    },
    sizeScreen: {
        type: Schema.Types.ObjectId,
        ref: "SizeScreen",
        required: [true, "Kích cỡ màn hình là bắt buộc."],
    },
    scanFrequency: {
        type: Schema.Types.ObjectId,
        ref: "ScanFrequencyScreen",
        required: [true, "Tần số quét màn hình là bắt buộc."],
    },
    resolutionScreen: {
        type: Schema.Types.ObjectId,
        ref: "ResolutionScreen",
        required: [true, "Độ phân giải màn hình là bắt buộc."],
    },
    typeRam: {
        type: Schema.Types.ObjectId,
        ref: "TypeRam",
        required: [true, "Công nghệ RAM là bắt buộc."],
    },
    capacityRam: {
        type: Schema.Types.ObjectId,
        ref: "CapacityRam",
        required: [true, "Dung lượng RAM là bắt buộc."],
    },
    typeRom: {
        type: Schema.Types.ObjectId,
        ref: "TypeRom",
        required: [true, "Công nghệ ROM là bắt buộc."],
    },
    capacityRom: {
        type: Schema.Types.ObjectId,
        ref: "CapacityRom",
        required: [true, "Dung lượng ROM là bắt buộc."],
    },
    gpu: {
        type: Schema.Types.ObjectId,
        ref: "GPU",
        required: [true, "Thông tin GPU là bắt buộc."],
    },
    cpu: {
        type: Schema.Types.ObjectId,
        ref: "CPU",
        required: [true, "Thông tin CPU là bắt buộc."],
    },
    os: {
        type: Schema.Types.ObjectId,
        ref: "OS",
        required: [true, "Thông tin hệ điều hành là bắt buộc."],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Thông tin nhu cầu người dùng là bắt buộc."],
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: [true, "Thông tin thương hiệu là bắt buộc."],
    },
    discount: {
        type: Schema.Types.ObjectId,
        ref: "Discount",
    },
    approve: {
        type: Boolean,
        required: [true, "Trạng thái sản phẩm là duyệt sản phẩm là bắt buộc."],
    },
    status: {
        type: Boolean,
        required: [true, "Trạng thái sản phẩm là bắt buộc."],
    },
    sold: {
        type: Number,
        default: 0,
    },
    addressPickupProduct: {
        type: String,
        required: [true, "Địa chỉ lấy hàng là cần thiết."],
    },
});

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
