export class ValidationError extends Error {
    statusCode: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode ?? 400;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}