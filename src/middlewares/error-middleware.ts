import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err.statusCode) {
        res.status(err.statusCode).json({
            message: err.message
        });
    }

    res.status(500).json({
        message: 'Ops... Something unexpected has happened',
        error: err.message || 'Unknown Error'
    });
};

export default errorMiddleware;