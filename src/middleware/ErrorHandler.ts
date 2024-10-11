import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class GlobalMiddleware{
    static checkError(req,res,next) {
        //This block ensures that if the incoming request data does not meet the validation requirements,
        //the process is halted, and an error is passed to the error-handling middleware. 
        //This prevents the code from attempting to save invalid data to the database
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new Error(errors.array()[0].msg));
        } else {
            next()
        }
    }
}