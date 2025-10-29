// src/models/Room.js
export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    roomId: { type: DataTypes.STRING, unique: true, allowNull: false },
    status: { type: DataTypes.ENUM('waiting', 'playing', 'finished'), defaultValue: 'waiting' }
  }, {
    timestamps: true
  });

  Room.associate = (models) => {
    Room.belongsTo(models.User, { as: 'Player1', foreignKey: 'player1Id' });
    Room.belongsTo(models.User, { as: 'Player2', foreignKey: 'player2Id' });
  };

  return Room;
};