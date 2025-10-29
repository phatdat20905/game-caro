// src/migrations/20241030-create-admin-log.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdminLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      targetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('AdminLogs', ['adminId']);
    await queryInterface.addIndex('AdminLogs', ['targetId']);
    await queryInterface.addIndex('AdminLogs', ['action']);
    await queryInterface.addIndex('AdminLogs', ['createdAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AdminLogs');
  }
};