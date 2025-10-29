// src/middleware/auth.middleware.js
import { verifyAccessToken } from '../utils/jwt.js';
import db from '../models/index.js';

const { User } = db;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.userId, {
      attributes: ['id', 'username', 'avatar', 'role', 'status', 'isBanned']
    });

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.isBanned) return res.status(403).json({ error: 'User is banned' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(); // Không có token thì vẫn cho qua
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.userId, {
      attributes: ['id', 'username', 'avatar', 'role', 'status', 'isBanned']
    });
    if (user && !user.isBanned) req.user = user;
  } catch {
    // Nếu token lỗi thì vẫn cho qua, không gán req.user
  }
  next();
};

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.userId);
    if (!user || user.isBanned) return next(new Error('Invalid user'));

    socket.user = { id: user.id, username: user.username, avatar: user.avatar };
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
};