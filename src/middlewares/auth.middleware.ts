import { Request, Response, NextFunction } from 'express';
import { extractBearerToken, verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

/**
 * authMiddleware
 *
 * Validates the Bearer access token in the Authorization header.
 * On success, attaches the decoded payload to `req.user`.
 */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = extractBearerToken(req.headers.authorization);
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    // Pass ApiErrors directly; wrap unknown errors
    if (err instanceof ApiError) {
      next(err);
    } else {
      next(ApiError.unauthorized());
    }
  }
}
