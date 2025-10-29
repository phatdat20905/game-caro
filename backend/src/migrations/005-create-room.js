// src/migrations/20241030-create-room.js
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      roomId: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      player1Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      player2Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('waiting', 'playing', 'finished'),
        defaultValue: 'waiting'
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

    await queryInterface.addIndex('Rooms', ['roomId'], { unique: true });
    await queryInterface.addIndex('Rooms', ['status']);
    await queryInterface.addIndex('Rooms', ['player1Id']);
    await queryInterface.addIndex('Rooms', ['player2Id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Rooms');
  }
};