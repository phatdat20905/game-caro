// src/routes/auth.routes.js
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validate, registerSchema, loginSchema, refreshSchema } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refreshToken);
router.post('/logout', AuthController.logout); // Không cần auth vì chỉ xóa token

export default router;