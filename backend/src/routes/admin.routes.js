// src/routes/admin.routes.js
import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.post('/ban', AdminController.ban);
router.get('/online', AdminController.online);

export default router;