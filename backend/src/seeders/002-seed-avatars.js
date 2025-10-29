// src/seeders/20241030-seed-avatars.js
export default {
  up: async (queryInterface) => {
    // Không cần seed avatar nếu dùng file tĩnh
    console.log('Avatars are served from /public/avatars');
  },
  down: async () => {}
};