import bcrypt from "bcryptjs";
import { Model, Schema, model } from "mongoose";
import { emailRegex, phoneRegex } from "../regex";
import {
    MAX_LENGTH_EMAIL_ACCEPT,
    MAX_LENGTH_NAME_ACCEPT,
    MAX_LENGTH_PASSWORD_ACCEPT,
    MIN_LENGTH_NAME_ACCEPT,
    MIN_LENGTH_PASSWORD_ACCEPT,
} from "../constants/user";
import configs from "../configs";

export interface IUser {
    id: Schema.Types.ObjectId;
    email: string;
    password: string;
    role: Schema.Types.ObjectId;
    refreshToken: string;
    name: string;
    avatar: string;
    address: Schema.Types.ObjectId[];
    phone: string;
    gender: boolean;
    birthday: Date;
    favorites: Schema.Types.ObjectId[];
    recommendationPrice: number;
}

interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

type TUserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, IUserMethods, TUserModel>(
    {
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "Vui lòng nhập Email."],
            match: [emailRegex, "Vui lòng nhập đúng định dạng Email."],
            maxlength: [
                MAX_LENGTH_EMAIL_ACCEPT,
                `Địa chỉ email chỉ được phép ${MAX_LENGTH_EMAIL_ACCEPT}`,
            ],
        },
        password: {
            type: String,
            required: [true, "Vui lòng nhập Password."],
            maxlength: [
                MAX_LENGTH_PASSWORD_ACCEPT,
                `Độ dài tối đa của mật khẩu chỉ ${MAX_LENGTH_PASSWORD_ACCEPT} ký tự.`,
            ],
            minlength: [
                MIN_LENGTH_PASSWORD_ACCEPT,
                `Độ dài của mật khẩu không được ít hơn ${MIN_LENGTH_PASSWORD_ACCEPT} ký tự.`,
            ],
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
        refreshToken: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            required: [true, "Tên là bắt buộc."],
            trim: true,
            maxlength: [
                MAX_LENGTH_NAME_ACCEPT,
                `Độ dài tối đa của tên là ${MAX_LENGTH_NAME_ACCEPT} ký tự.`,
            ],
            minlength: [
                MIN_LENGTH_NAME_ACCEPT,
                `Độ dài tối thiểu của tên là ${MIN_LENGTH_NAME_ACCEPT} ký tự.`,
            ],
        },
        avatar: String,
        birthday: {
            type: Date,
            default: new Date("1988-12-31"),
        },
        address: [
            {
                type: Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
        phone: {
            type: String,
            match: [phoneRegex, "Vui lòng nhập đúng định dạng số điện thoại."],
        },
        gender: {
            type: Boolean,
            default: true,
        },
        favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        recommendationPrice: {
            type: Number,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    const user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();
    // Generate a salt
    bcrypt.genSalt(configs.saltPassword, function (err, salt) {
        if (err) return next(err);
        // Hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // Override the cleartext width the hashed one
            user.password = hash;
            return next();
        });
    });
});

userSchema.methods.comparePassword = async function (password: string) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

const UserModel = model<IUser, TUserModel>("User", userSchema);

export default UserModel;
