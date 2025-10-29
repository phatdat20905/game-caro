// src/models/AdminLog.js
export default (sequelize, DataTypes) => {
  const AdminLog = sequelize.define('AdminLog', {
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT }
  }, {
    timestamps: true
  });

  AdminLog.associate = (models) => {
    AdminLog.belongsTo(models.User, { as: 'Admin', foreignKey: 'adminId' });
    AdminLog.belongsTo(models.User, { as: 'Target', foreignKey: 'targetId' });
  };

  return AdminLog;
};