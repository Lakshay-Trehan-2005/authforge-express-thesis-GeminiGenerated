import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import sessionRoutes from './session.routes';
import refreshRoutes from './refresh.routes';
import logoutRoutes from './logout.routes';
import adminRoutes from './admin.routes';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

// POST   /api/users          → Register
// GET    /api/users/me       → Get own profile
router.use('/users', userRoutes);

// POST   /api/sessions       → Login (create session)
// GET    /api/sessions       → List active sessions
// DELETE /api/sessions/:id   → Revoke session
router.use('/sessions', sessionRoutes);

// POST   /api/token          → Refresh access token
router.use('/token', refreshRoutes);

// POST   /api/logout         → Logout (single session)
// POST   /api/logout/all     → Logout all sessions
router.use('/logout', logoutRoutes);

// GET    /api/admin/*        → Admin-only actions
router.use('/admin', adminRoutes);

export default router;
