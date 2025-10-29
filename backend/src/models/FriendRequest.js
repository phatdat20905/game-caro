// src/models/FriendRequest.js
export default (sequelize, DataTypes) => {
  const FriendRequest = sequelize.define('FriendRequest', {
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' }
  }, {
    timestamps: true
  });

  FriendRequest.associate = (models) => {
    FriendRequest.belongsTo(models.User, { as: 'From', foreignKey: 'fromId' });
    FriendRequest.belongsTo(models.User, { as: 'To', foreignKey: 'toId' });
  };

  return FriendRequest;
};