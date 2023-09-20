import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import configs from ".";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: configs.mail.account,
        pass: configs.mail.password,
    },
});

const mailerOptions = (
    to: string,
    subject: string,
    text: string,
    html?: string
): MailOptions => {
    return {
        to,
        subject,
        text,
        html,
    };
};

export { mailerOptions };
export default transporter;
