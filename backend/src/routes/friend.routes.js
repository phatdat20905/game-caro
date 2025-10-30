// src/routes/friend.routes.js
import { Router } from 'express';
import * as FriendController from '../controllers/friend.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/send', FriendController.send);
router.post('/accept/:requestId', FriendController.accept);
router.post('/decline/:requestId', FriendController.decline);
router.delete('/:friendId', FriendController.remove);
router.get('/', FriendController.list);
router.get('/requests', FriendController.requests);

export default router;