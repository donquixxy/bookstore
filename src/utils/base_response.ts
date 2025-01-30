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

export class PaginatedResponse<T> extends BaseResponse<T[]> {
    count: number;
    pages: number;
    current_page: number;
    limit: number;

    constructor(
        message: string,
        data: T[],
        totalItems: number,
        totalPages: number,
        currentPage: number,
        limit: number
    ) {
        super(message, data);
        this.count = totalItems;
        this.pages = totalPages;
        this.current_page = currentPage;
        this.limit = limit;
    }

    static SuccessPaginated<T>(
        message: string,
        data: T[],
        totalItems: number,
        currentPage: number,
        limit: number
    ): PaginatedResponse<T> {
        const totalPages = Math.ceil(totalItems / limit);
        return new PaginatedResponse<T>(message, data, totalItems, totalPages, currentPage, limit);
    }

    static ErrorPaginated<T>(message: string, errorMsg: string[], data?: T[]): PaginatedResponse<T> {
        return new PaginatedResponse<T>(message, data ?? [], 0, 0, 0, 0);
    }
}

export default BaseResponse;