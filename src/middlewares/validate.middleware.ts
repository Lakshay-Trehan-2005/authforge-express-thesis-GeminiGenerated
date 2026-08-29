import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * validate
 *
 * Factory that returns a middleware validating the specified request target
 * against a Joi schema. On failure, passes a 400 ApiError with all
 * Joi validation messages.
 *
 * @param schema  - Joi object schema
 * @param target  - 'body' | 'query' | 'params'  (default: 'body')
 */
export function validate(schema: Joi.ObjectSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,    // collect ALL errors
      stripUnknown: true,   // remove unknown keys (security)
      convert: true,        // coerce types (lowercase, trim, etc.)
    });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return next(ApiError.badRequest('Validation failed', messages));
    }

    // Replace request data with the sanitised/coerced value
    req[target] = value;
    next();
  };
}
