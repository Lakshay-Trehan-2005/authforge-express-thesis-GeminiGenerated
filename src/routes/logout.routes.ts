import { Router } from 'express';
import logoutController from '../controllers/logout.controller';
import validate from '../middlewares/validate.middleware';
import { refreshSchema } from '../validators/session.validator';

const router = Router();

// POST /api/logout - Invalidate current session (revoke refresh token)
router.post('/', validate(refreshSchema), logoutController.logout);

export default router;
