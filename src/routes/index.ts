import { Router } from 'express';
import userRoutes from './user.routes';
import sessionRoutes from './session.routes';
import refreshRoutes from './refresh.routes';
import logoutRoutes from './logout.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Register route modules
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/token', refreshRoutes);
router.use('/logout', logoutRoutes);
router.use('/admin', adminRoutes);

export default router;
