import { Router } from 'express';
import * as RoomController from '../controllers/room.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate); // Tất cả cần đăng nhập

router.post('/', RoomController.create);           // POST /api/rooms
router.post('/join/:roomId', RoomController.join); // POST /api/rooms/join/ABC123
router.get('/', RoomController.list);              // GET /api/rooms

export default router;