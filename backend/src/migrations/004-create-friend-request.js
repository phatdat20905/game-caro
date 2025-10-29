// src/migrations/20241030-create-friend-request.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FriendRequests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fromId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      toId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
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

    await queryInterface.addIndex('FriendRequests', ['fromId']);
    await queryInterface.addIndex('FriendRequests', ['toId']);
    await queryInterface.addIndex('FriendRequests', ['fromId', 'toId'], { unique: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('FriendRequests');
  }
};