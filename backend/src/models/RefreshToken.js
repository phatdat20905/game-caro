// src/models/RefreshToken.js
export default (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false }
  }, {
    timestamps: true
  });

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return RefreshToken;
};