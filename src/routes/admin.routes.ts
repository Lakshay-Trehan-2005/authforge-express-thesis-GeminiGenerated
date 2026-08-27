import { Router } from 'express';
import protect from '../middlewares/auth.middleware';
import restrictTo from '../middlewares/role.middleware';

const router = Router();

// GET /api/admin/dashboard - Protected route, restricted to users with 'admin' role
router.get('/dashboard', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Dashboard!',
    adminUser: req.user,
  });
});

export default router;
