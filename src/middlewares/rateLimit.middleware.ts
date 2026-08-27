import rateLimit from 'express-rate-limit';
import env from '../config/env';
import ApiError from '../utils/ApiError';

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Too many requests from this IP, please try again later.'));
  },
});

export default authLimiter;
