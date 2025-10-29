// src/migrations/20241030-create-friend.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Friends', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      friendId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted'),
        defaultValue: 'accepted'
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

    await queryInterface.addIndex('Friends', ['userId']);
    await queryInterface.addIndex('Friends', ['friendId']);
    await queryInterface.addIndex('Friends', ['userId', 'friendId'], { unique: true });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Friends');
  }
};