// import type { ZodTypeAny } from 'zod/v3';
// import { createSubmissionZodSchema } from '../dtos/CreateSubmissionDto.js';
import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';

//define middleware

// export const validateCreateSubmissionDto = (schema: typeof createSubmissionZodSchema) => (req: Request, res: Response, next: NextFunction)=>{  FOR SPECIFIC THING MIDDLEWARE
export const validateDto = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction)=>{
    try {
        // schema.parse({ ... req.body });  another way
        const parsed = schema.parse(req.body);
        req.body = parsed;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Invalid request params receive',
            error: error
        });
        
    }
};