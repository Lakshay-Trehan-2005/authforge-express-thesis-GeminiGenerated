import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { refreshTokenSchema } from '../validators/session.validator';
import { refreshToken } from '../controllers/refresh.controller';

const router = Router();

/**
 * POST /api/token
 * Accept a valid refresh token and return a new access token.
 */
router.post(
  '/',
  authRateLimiter,
  validate(refreshTokenSchema),
  refreshToken
);

export default router;
