import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized: Access token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Unauthorized: Access token is empty');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
