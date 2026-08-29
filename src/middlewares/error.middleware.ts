import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

/**
 * notFoundHandler
 *
 * Catch-all for routes that were not matched; produces a 404 ApiError.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * errorHandler
 *
 * Central Express error-handling middleware. Must have exactly 4 parameters.
 * Formats errors into a consistent JSON envelope.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  // next is required by Express to identify this as an error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Handle known operational errors
  if (err instanceof ApiError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && err.errors.length > 0 ? { errors: err.errors } : {}),
    });
    return;
  }

  // Mongoose duplicate key error (e.g. unique email)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mongoErr = err as any;
  if (mongoErr.code === 11000 && mongoErr.keyValue) {
    const field = Object.keys(mongoErr.keyValue)[0];
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as unknown as { errors: Record<string, { message: string }> }).errors).map(
      (e) => e.message
    );
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
    return;
  }

  // Log unhandled / programming errors (do NOT expose internals to client)
  console.error('[Unhandled Error]', err);

  res.status(500).json({
    success: false,
    message: env.isProduction
      ? 'An unexpected error occurred. Please try again later.'
      : (err.message ?? 'Internal server error'),
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};
