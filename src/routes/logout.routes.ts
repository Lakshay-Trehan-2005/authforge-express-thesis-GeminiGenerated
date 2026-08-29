import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { logoutSchema } from '../validators/session.validator';
import { logout, logoutAll } from '../controllers/logout.controller';

const router = Router();

/**
 * POST /api/logout
 * Invalidate the current session using the provided refresh token.
 */
router.post(
  '/',
  authRateLimiter,
  validate(logoutSchema),
  logout
);

/**
 * POST /api/logout/all
 * Invalidate ALL sessions for the authenticated user.
 * Requires a valid access token.
 */
router.post('/all', authMiddleware, logoutAll);

export default router;
