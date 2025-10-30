// src/socket/user.socket.js
import db from '../models/index.js';

const { User } = db;

// Track online users
const onlineUsers = new Map(); // userId -> socketId

export default (io, socket) => {
  /**
   * Update user status and broadcast
   */
  const updateStatus = async (status) => {
    try {
      await User.update({ status }, { where: { id: socket.user.id } });
      
      // Broadcast to all clients
      io.emit('userStatusChange', { 
        userId: socket.user.id, 
        username: socket.user.username,
        status 
      });

      console.log(`👤 ${socket.user.username} is now ${status}`);
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  // User connected - set online
  (async () => {
    onlineUsers.set(socket.user.id, socket.id);
    await updateStatus('online');

    // Send current online users list
    const onlineUsersList = await User.findAll({
      where: { status: ['online', 'in-game'] },
      attributes: ['id', 'username', 'avatar', 'status', 'score']
    });
    
    socket.emit('onlineUsers', onlineUsersList);
    io.emit('onlineCount', onlineUsers.size);
  })();

  /**
   * Get online users
   */
  socket.on('getOnlineUsers', async () => {
    try {
      const users = await User.findAll({
        where: { status: ['online', 'in-game'] },
        attributes: ['id', 'username', 'avatar', 'status', 'score'],
        order: [['score', 'DESC']]
      });
      
      socket.emit('onlineUsers', users);
    } catch (error) {
      console.error('Get online users error:', error);
      socket.emit('onlineUsers', []);
    }
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', async () => {
    onlineUsers.delete(socket.user.id);
    await updateStatus('offline');
    io.emit('onlineCount', onlineUsers.size);
  });
};

export { onlineUsers };