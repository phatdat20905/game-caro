// src/seeders/20241030-seed-admin.js
import bcrypt from 'bcryptjs';

export default {
  up: async (queryInterface) => {
    const hashed = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: hashed,
      role: 'admin',
      score: 9999,
      avatar: '/avatars/admin.png',
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', { username: 'admin' });
  }
};