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

export const getUserStats = async (userId) => {
  const { Game } = db;
  
  const totalGames = await Game.count({
    where: {
      [db.Sequelize.Op.or]: [
        { player1Id: userId },
        { player2Id: userId }
      ]
    }
  });

  const wins = await Game.count({
    where: {
      winner: userId
    }
  });

  const losses = await Game.count({
    where: {
      [db.Sequelize.Op.and]: [
        {
          [db.Sequelize.Op.or]: [
            { player1Id: userId },
            { player2Id: userId }
          ]
        },
        { winner: { [db.Sequelize.Op.ne]: null } },
        { winner: { [db.Sequelize.Op.ne]: userId } }
      ]
    }
  });

  const draws = await Game.count({
    where: {
      [db.Sequelize.Op.and]: [
        {
          [db.Sequelize.Op.or]: [
            { player1Id: userId },
            { player2Id: userId }
          ]
        },
        { winner: null }
      ]
    }
  });

  return {
    totalGames,
    wins,
    losses,
    draws
  };
};

export const getUserGames = async (userId) => {
  const { Game } = db;
  
  return await Game.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        { player1Id: userId },
        { player2Id: userId }
      ]
    },
    include: [
      { model: User, as: 'player1', attributes: ['id', 'username', 'avatar'] },
      { model: User, as: 'player2', attributes: ['id', 'username', 'avatar'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: 50
  });
};