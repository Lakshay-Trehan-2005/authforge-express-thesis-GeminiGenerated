import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import ApiError from '../utils/ApiError';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;
      
      // Re-assign parsed values to request
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.query !== undefined) {
        for (const key of Object.keys(parsed.query)) {
          req.query[key] = parsed.query[key];
        }
      }
      if (parsed.params !== undefined) {
        for (const key of Object.keys(parsed.params)) {
          req.params[key] = parsed.params[key];
        }
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((err) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        next(new ApiError(400, 'Validation error', true, errorDetails));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
