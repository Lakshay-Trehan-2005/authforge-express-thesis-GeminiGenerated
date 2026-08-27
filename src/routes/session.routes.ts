import { Router } from 'express';
import sessionController from '../controllers/session.controller';
import validate from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/session.validator';
import authLimiter from '../middlewares/rateLimit.middleware';

const router = Router();

// POST /api/sessions - Login user (with IP rate limiting)
router.post('/', authLimiter, validate(loginSchema), sessionController.login);

export default router;
