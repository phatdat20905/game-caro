// src/routes/user.routes.js
import { Router } from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// Public: Xem profile người khác
router.get('/profile/:id', optionalAuth, UserController.getProfile);

// Auth required
router.use(authenticate);
router.get('/me', UserController.getMe);
router.put('/avatar', UserController.updateAvatar);
router.post('/update-avatar', UserController.updateAvatar);
router.get('/search', UserController.search);
router.get('/stats', UserController.getStats);
router.get('/games', UserController.getGames);

// Admin only
router.get('/all', requireAdmin, UserController.getAllUsers);

export default router;