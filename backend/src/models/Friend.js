// src/models/Friend.js
export default (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    status: { type: DataTypes.ENUM('pending', 'accepted'), defaultValue: 'accepted' }
  }, {
    timestamps: true
  });

  Friend.associate = (models) => {
    Friend.belongsTo(models.User, { as: 'User', foreignKey: 'userId' });
    Friend.belongsTo(models.User, { as: 'FriendUser', foreignKey: 'friendId' });
  };

  return Friend;
};