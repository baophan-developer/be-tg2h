import HttpStatusCode from "../enums/http.status.code";

interface ResponseError extends Error {
    status: HttpStatusCode;
}

class ResponseError extends Error {
    status: HttpStatusCode;
    constructor(status: HttpStatusCode, message: string) {
        super(message);
        this.status = status;
    }
}

export { ResponseError };
export default ResponseError;
