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