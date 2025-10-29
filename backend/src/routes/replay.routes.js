// src/routes/replay.routes.js
import { Router } from 'express';
import * as ReplayController from '../controllers/replay.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:gameId', authenticate, ReplayController.getReplay);

export default router;