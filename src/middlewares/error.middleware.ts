import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ApiError from '../utils/ApiError';
import env from '../config/env';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = field ? `Duplicate field: ${field} already exists.` : 'Resource already exists.';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle JWT signature error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Unauthorized: Invalid access token signature';
  }

  // Handle JWT expiration error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Unauthorized: Access token has expired';
  }

  // Hide internal server errors details in production
  if (statusCode === 500 && env.NODE_ENV === 'production') {
    message = 'Something went wrong on our end';
  }

  const responseBody: {
    success: boolean;
    message: string;
    errors?: any[];
    stack?: string;
  } = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Log server errors (500)
  if (statusCode === 500) {
    console.error(`💥 [500 Error]: ${err.stack || err}`);
  }

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
