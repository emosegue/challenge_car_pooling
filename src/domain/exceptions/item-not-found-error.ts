export class ItemNotFoundError extends Error {
    statusCode: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode ?? 404;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}