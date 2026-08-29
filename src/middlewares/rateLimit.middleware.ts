import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { env } from '../config/env';

/**
 * globalRateLimiter
 *
 * Applied to every route; limits by IP address.
 * Window and max are read from environment variables.
 */
export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
});

/**
 * authRateLimiter
 *
 * Stricter limiter applied specifically to authentication endpoints
 * (login, register, token refresh) to slow brute-force attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                    // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait and try again.',
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please wait and try again.',
    });
  },
});
