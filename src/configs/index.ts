import * as dotenv from "dotenv";

dotenv.config();

const configs = {
    port: process.env.PORT || "8080",
    saltPassword: 10,
    db: {
        url: process.env.DATABASE_URL || "mongodb://localhost:27017/project_graduation",
    },
    client: {
        user: process.env.CLIENT_HOST_USER || "http://localhost:3000",
        admin: process.env.CLIENT_HOST_ADMIN || "http://localhost:3001",
    },
    jwt: {
        accessToken: {
            secret: process.env.JWT_SECRET_ACCESSTOKEN || "your_key",
            expires: process.env.JWT_EXPIRES_IN_ACCESSTOKEN || "7200s",
        },
        refreshToken: {
            secret: process.env.JWT_SECRET_REFRESHTOKEN || "your_key",
            expires: process.env.JWT_EXPIRES_IN_REFRESHTOKEN || "1d",
        },
        resetPassword: {
            secret: process.env.JWT_SECRET_RESETPASSWORD || "your_key",
            expires: process.env.JWT_EXPIRES_IN_RESETPASSWORD || "3200s",
        },
    },
    mail: {
        account: process.env.GMAIL_ACCOUNT || "thegioi2hand.mailer@gmail.com",
        password: process.env.GMAIL_PASS || "lkpcrgslpshcodve",
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_NAME || "ddzf1nf7b",
        apiKey: process.env.CLOUDINARY_KEY || "548534626599792",
        apiSecret: process.env.CLOUDINARY_SECRET || "_1s1wUgT6j4OksXEke3ON2nYOpg",
    },
    defaultAvatar:
        process.env.DEFAULT_AVATAR ||
        "https://res.cloudinary.com/ddzf1nf7b/image/upload/v1696660756/avatar/vgamlzfpzywilindr4ug.png",
};

export default configs;
