// src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import roomRoutes from './room.routes.js';
import friendRoutes from './friend.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/friends', friendRoutes);

export default router;