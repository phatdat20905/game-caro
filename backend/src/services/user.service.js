// src/services/user.service.js
import db from '../models/index.js';

const { User, Friend } = db;

export const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'avatar', 'score', 'status', 'role', 'isBanned']
  });
  if (!user) throw new Error('User not found');
  return user;
};

export const getProfile = async (profileId, viewerId) => {
  const user = await User.findByPk(profileId, {
    attributes: ['id', 'username', 'avatar', 'score', 'status', 'createdAt']
  });
  if (!user) throw new Error('User not found');

  if (viewerId && viewerId !== profileId) {
    const friendship = await Friend.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { userId: viewerId, friendId: profileId },
          { userId: profileId, friendId: viewerId }
        ]
      }
    });
    user.dataValues.isFriend = !!friendship;
  }

  return user;
};

export const updateAvatar = async (userId, avatar) => {
  const validAvatars = Array.from({ length: 10 }, (_, i) => `/avatars/avatar${i + 1}.png`).concat(['/avatars/default.png']);
  if (!validAvatars.includes(avatar)) throw new Error('Invalid avatar');

  const user = await User.findByPk(userId);
  await user.update({ avatar });
  return { id: user.id, avatar: user.avatar };
};

export const searchUsers = async (query, currentUserId) => {
  return await User.findAll({
    where: {
      username: { [db.Sequelize.Op.iLike]: `%${query}%` },
      id: { [db.Sequelize.Op.ne]: currentUserId },
      isBanned: false
    },
    attributes: ['id', 'username', 'avatar', 'status'],
    limit: 10
  });
};

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'username', 'role', 'isBanned', 'score', 'status'],
    order: [['score', 'DESC']]
  });
};