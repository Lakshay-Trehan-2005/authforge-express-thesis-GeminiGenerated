import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createSessionSchema } from '../validators/session.validator';
import {
  createSession,
  getMySessions,
  invalidateSession,
} from '../controllers/session.controller';

const router = Router();

/**
 * POST /api/sessions
 * Login: authenticate credentials and issue access + refresh tokens.
 */
router.post(
  '/',
  authRateLimiter,
  validate(createSessionSchema),
  createSession
);

/**
 * GET /api/sessions
 * List all active sessions for the authenticated user.
 */
router.get('/', authMiddleware, getMySessions);

/**
 * DELETE /api/sessions/:id
 * Invalidate a specific session.
 */
router.delete('/:id', authMiddleware, invalidateSession);

export default router;
