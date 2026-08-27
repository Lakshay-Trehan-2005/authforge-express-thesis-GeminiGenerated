import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const restrictTo = (...allowedRoles: ('user' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized: User authentication is required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Forbidden: You do not have permission to access this resource`)
      );
    }

    next();
  };
};

export default restrictTo;
