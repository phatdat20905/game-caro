// src/socket/user.socket.js
import db from '../models/index.js';

const { User } = db;

export default (io, socket) => {
  const updateStatus = async (status) => {
    await User.update({ status }, { where: { id: socket.user.id } });
    io.emit('userStatus', { userId: socket.user.id, status });
  };

  // Vào online
  updateStatus('online');

  socket.on('disconnect', () => {
    updateStatus('offline');
  });
};