
export class NotFoundError extends Error {
    public msg:string;
    public statusCode:number = 404;

    constructor(message:string) {
        super(message);
        this.msg = message
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends Error {
    public msg:string;
    public statusCode:number = 400;

    constructor(message:string) {
        super();
        this.msg = message
        Error.captureStackTrace(this, this.constructor)
    }
}

export class DbError extends Error {
    public msg:string;
    public statusCode:number = 500;

    constructor(message:string) {
        super(message);
        this.msg = message
        Error.captureStackTrace(this, this.constructor)
    }
}