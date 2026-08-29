import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { registerSchema } from '../validators/user.validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  registerUser,
  getMe,
} from '../controllers/user.controller';

const router = Router();

/**
 * POST /api/users
 * Register a new user.
 * Rate-limited to prevent mass account creation.
 */
router.post(
  '/',
  authRateLimiter,
  validate(registerSchema),
  registerUser
);

/**
 * GET /api/users/me
 * Retrieve the authenticated user's own profile.
 */
router.get('/me', authMiddleware, getMe);

export default router;
