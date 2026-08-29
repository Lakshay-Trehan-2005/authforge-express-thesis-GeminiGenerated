import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.model';
import { ApiError } from '../utils/ApiError';

/**
 * roleMiddleware
 *
 * Factory that returns a middleware allowing only the specified roles.
 * Must be used after authMiddleware (which populates req.user).
 *
 * @example
 * router.get('/admin', authMiddleware, roleMiddleware('admin'), handler);
 * router.get('/any',   authMiddleware, roleMiddleware('user', 'admin'), handler);
 */
export function roleMiddleware(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
}
