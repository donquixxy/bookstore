class BaseResponse<T> {
    message?: string;
    data?: T;
    error?: string[];

    constructor(message?: string, data?: T, errorMsg?: string[]) {
        this.message = message;
        this.data = data;
        this.error = errorMsg;
    }

    static SuccessResponse<T>(message: string, data: T): BaseResponse<T> {
        return new BaseResponse<T>(message, data);
    }

    static ErrorResponse<T>(message: string, errorMsg: string[], data?: T): BaseResponse<T> {
        return new BaseResponse<T>(message, data, errorMsg);
    }
}

export default BaseResponse;