// src/seeders/20241030-seed-sample-users.js
import bcrypt from 'bcryptjs';

export default {
  up: async (queryInterface) => {
    const hashed = await bcrypt.hash('123456', 10);
    await queryInterface.bulkInsert('Users', [
      { username: 'player1', password: hashed, score: 100, avatar: '/avatars/avatar1.png', createdAt: new Date(), updatedAt: new Date() },
      { username: 'player2', password: hashed, score: 200, avatar: '/avatars/avatar2.png', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', { username: ['player1', 'player2'] });
  }
};