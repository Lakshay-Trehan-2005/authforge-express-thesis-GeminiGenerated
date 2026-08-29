import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import {
  getAllUsers,
  deactivateUser,
} from '../controllers/user.controller';
import {
  invalidateSession,
} from '../controllers/session.controller';

const router = Router();

// All admin routes require authentication + admin role
router.use(authMiddleware, roleMiddleware('admin'));

/**
 * GET /api/admin/users
 * List all registered users.
 */
router.get('/users', getAllUsers);

/**
 * DELETE /api/admin/users/:id
 * Deactivate a user account by ID.
 */
router.delete('/users/:id', deactivateUser);

/**
 * DELETE /api/admin/sessions/:id
 * Force-invalidate any session by ID (admin power action).
 */
router.delete('/sessions/:id', invalidateSession);

/**
 * GET /api/admin/health
 * Admin health check endpoint.
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Admin endpoint healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
