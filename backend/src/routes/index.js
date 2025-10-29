// src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import roomRoutes from './room.routes.js';
import friendRoutes from './friend.routes.js';
import adminRoutes from './admin.routes.js';
import gameRoutes from './game.routes.js';
import replayRoutes from './replay.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/friends', friendRoutes);
router.use('/admin', adminRoutes);
router.use('/games', gameRoutes);
router.use('/replay', replayRoutes);

export default router;