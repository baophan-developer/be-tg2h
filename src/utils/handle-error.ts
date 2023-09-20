import HttpStatusCode from "../enums/http-status-code";
import ResponseError from "./error-api";

const handleError = (error: ResponseError | any) => {
    let status = error.status;
    let message = error.message;

    // handle message validate of mongoose return
    let messageValidate: string[] = [];
    for (const key in error.errors) {
        messageValidate.push(error.errors[key].message);
    }

    if (messageValidate.length > 0) {
        status = HttpStatusCode.UNPROCESSABLE_ENTITY;
        message = messageValidate;
    }

    return {
        status,
        message,
    };
};

export default handleError;
