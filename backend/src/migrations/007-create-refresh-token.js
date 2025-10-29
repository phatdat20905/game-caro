// src/migrations/20241031-create-refresh-token.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
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

    await queryInterface.addIndex('RefreshTokens', ['token'], { unique: true });
    await queryInterface.addIndex('RefreshTokens', ['userId']);
    await queryInterface.addIndex('RefreshTokens', ['expiresAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('RefreshTokens');
  }
};