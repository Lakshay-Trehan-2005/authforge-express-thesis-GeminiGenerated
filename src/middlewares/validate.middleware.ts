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
        // req.query is a getter/read-only on Request; mutate the object instead of re-assigning it
        Object.assign(req.query, parsed.query);
      }
      if (parsed.params !== undefined) {
        // req.params is a getter/read-only on Request; mutate the object instead of re-assigning it
        Object.assign(req.params, parsed.params);
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
