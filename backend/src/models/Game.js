// src/models/Game.js
export default (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    moves: { type: DataTypes.JSON, defaultValue: [] },
    winnerId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    timestamps: true
  });

  Game.associate = (models) => {
    Game.belongsTo(models.User, { as: 'Player1', foreignKey: 'player1Id' });
    Game.belongsTo(models.User, { as: 'Player2', foreignKey: 'player2Id' });
    Game.belongsTo(models.User, { as: 'Winner', foreignKey: 'winnerId' });
  };

  return Game;
};