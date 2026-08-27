import { Router } from 'express';
import refreshController from '../controllers/refresh.controller';
import validate from '../middlewares/validate.middleware';
import { refreshSchema } from '../validators/session.validator';

const router = Router();

// POST /api/token - Refresh access token using active refresh token
router.post('/', validate(refreshSchema), refreshController.refresh);

export default router;
