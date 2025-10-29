import db from '../models/index.js';

const { Game, User } = db;

export const saveGame = async ({ player1Id, player2Id, winnerId, moves }) => {
  const game = await Game.create({ player1Id, player2Id, winnerId, moves });

  // Cập nhật điểm
  if (winnerId) {
    await User.increment('score', { by: 10, where: { id: winnerId } });
  }

  return game;
};

export const getLeaderboard = async () => {
  return await User.findAll({
    attributes: ['id', 'username', 'avatar', 'score'],
    where: { isBanned: false },
    order: [['score', 'DESC']],
    limit: 10
  });
};

export const getHistory = async (userId) => {
  return await Game.findAll({
    where: { [db.Sequelize.Op.or]: [{ player1Id: userId }, { player2Id: userId }] },
    include: [
      { model: User, as: 'Player1', attributes: ['username'] },
      { model: User, as: 'Player2', attributes: ['username'] },
      { model: User, as: 'Winner', attributes: ['username'] }
    ],
    order: [['createdAt', 'DESC']],
    limit: 20
  });
};
