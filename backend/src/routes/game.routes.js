import { Router } from 'express';
import * as GameController from '../controllers/game.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/leaderboard', optionalAuth, GameController.leaderboard);
router.get('/history', authenticate, GameController.history);

export default router;