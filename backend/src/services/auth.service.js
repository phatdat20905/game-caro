// src/services/auth.service.js
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

const { User, RefreshToken } = db;

export const register = async ({ username, password }) => {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) throw new Error('Username already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });

  const accessToken = signAccessToken({ userId: user.id, username: user.username });
  const refreshToken = signRefreshToken({ userId: user.id });

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { user: { id: user.id, username: user.username, avatar: user.avatar }, accessToken, refreshToken };
};

export const login = async ({ username, password }) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessToken = signAccessToken({ userId: user.id, username: user.username });
  const refreshToken = signRefreshToken({ userId: user.id });

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { user: { id: user.id, username: user.username, avatar: user.avatar }, accessToken, refreshToken };
};

export const refresh = async (oldRefreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }

  const tokenRecord = await RefreshToken.findOne({ where: { token: oldRefreshToken, userId: payload.userId } });
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error('Refresh token expired or invalid');
  }

  const user = await User.findByPk(payload.userId);
  if (!user) throw new Error('User not found');

  const newAccessToken = signAccessToken({ userId: user.id, username: user.username });
  const newRefreshToken = signRefreshToken({ userId: user.id });

  // Xóa token cũ
  await tokenRecord.destroy();

  // Tạo token mới
  await RefreshToken.create({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken) => {
  await RefreshToken.destroy({ where: { token: refreshToken } });
};