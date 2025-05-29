import { NextFunction, Request, Response } from "express";
import { AppError } from "./index"


export const errorMiddleware = (err: Error, req: Request, res: Response , next : NextFunction) => {
    if (err instanceof AppError) {
        console.log(`Error ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            status: 'Error',
            message: err.message,
            ...(err.details && { details: err.details })
        })

    }
    console.log('Unhandled error : ', err);
    return res.status(500).json({
        error: 'Something went wrong , please try again'
    })
}