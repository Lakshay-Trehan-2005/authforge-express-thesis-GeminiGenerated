import { Router } from 'express';
import userController from '../controllers/user.controller';
import validate from '../middlewares/validate.middleware';
import { registerSchema } from '../validators/user.validator';
import authLimiter from '../middlewares/rateLimit.middleware';

const router = Router();

// POST /api/users - Register a new user (with IP rate limiting)
router.post('/', authLimiter, validate(registerSchema), userController.register);

export default router;
