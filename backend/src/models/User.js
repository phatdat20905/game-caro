// src/models/User.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    avatar: { type: DataTypes.STRING, defaultValue: '/avatars/default.png' },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
    isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
    banUntil: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('offline', 'online', 'in-game'), defaultValue: 'offline' }
  }, {
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Game, { as: 'GamesAsP1', foreignKey: 'player1Id' });
    User.hasMany(models.Game, { as: 'GamesAsP2', foreignKey: 'player2Id' });
    User.hasMany(models.Friend, { as: 'Friends', foreignKey: 'userId' });
    User.hasMany(models.FriendRequest, { as: 'SentRequests', foreignKey: 'fromId' });
    User.hasMany(models.FriendRequest, { as: 'ReceivedRequests', foreignKey: 'toId' });
    User.hasMany(models.AdminLog, { as: 'AdminActions', foreignKey: 'adminId' });
  };

  return User;
};