/**
 * ApiError — a structured operational error that flows through the Express
 * error-handling middleware. Operational errors (e.g. 400, 401, 404) are
 * intentionally surfaced to the client; programming errors are not.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown[];

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: unknown[],
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Restore prototype chain broken by extending built-in Error
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ─── Factory helpers ────────────────────────────────────────────────────────

  static badRequest(message: string, errors?: unknown[]): ApiError {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(message, 404);
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, 409);
  }

  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(message, 429);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(message, 500, undefined, false);
  }
}
