// src/migrations/20241030-create-user.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: '/avatars/default.png'
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      isBanned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      banUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('offline', 'online', 'in-game'),
        defaultValue: 'offline'
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

    await queryInterface.addIndex('Users', ['username'], { unique: true });
    await queryInterface.addIndex('Users', ['status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};