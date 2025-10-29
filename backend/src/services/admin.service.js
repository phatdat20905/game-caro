// src/services/admin.service.js
import db from '../models/index.js';

const { User, AdminLog } = db;

export const banUser = async (adminId, targetId, reason, days) => {
  const user = await User.findByPk(targetId);
  if (!user) throw new Error('User not found');

  const banUntil = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null;
  await user.update({ isBanned: true, banUntil });

  await AdminLog.create({
    adminId,
    targetId,
    action: 'ban',
    details: reason
  });

  return user;
};

export const getOnlineUsers = async () => {
  return await User.findAll({
    where: { status: 'online', isBanned: false },
    attributes: ['id', 'username', 'avatar']
  });
};