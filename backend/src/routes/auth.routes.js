// src/routes/auth.routes.js
import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

export default router;