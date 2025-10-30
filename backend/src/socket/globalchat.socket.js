// src/socket/globalchat.socket.js
const globalChatUsers = new Map(); // socketId -> user info

export default function globalChatHandler(io, socket) {
  // Join global chat
  socket.on('joinGlobalChat', () => {
    const userInfo = {
      id: socket.user.id,
      username: socket.user.username,
      avatar: socket.user.avatar
    };

    globalChatUsers.set(socket.id, userInfo);
    socket.join('globalChat');

    console.log(`💬 ${socket.user.username} joined global chat`);

    // Notify others
    socket.to('globalChat').emit('userJoinedGlobal', {
      username: socket.user.username
    });
  });

  // Leave global chat
  socket.on('leaveGlobalChat', () => {
    const userInfo = globalChatUsers.get(socket.id);
    if (userInfo) {
      socket.to('globalChat').emit('userLeftGlobal', {
        username: userInfo.username
      });
      globalChatUsers.delete(socket.id);
      socket.leave('globalChat');
      console.log(`💬 ${socket.user.username} left global chat`);
    }
  });

  // Send global chat message
  socket.on('globalChatMessage', ({ message }) => {
    if (!message || message.trim().length === 0) return;
    if (message.length > 200) return;

    const chatMessage = {
      userId: socket.user.id,
      username: socket.user.username,
      avatar: socket.user.avatar,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Broadcast to all in global chat (including sender)
    io.to('globalChat').emit('globalChatMessage', chatMessage);
    console.log(`💬 [Global] ${socket.user.username}: ${message.substring(0, 50)}...`);
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const userInfo = globalChatUsers.get(socket.id);
    if (userInfo) {
      socket.to('globalChat').emit('userLeftGlobal', {
        username: userInfo.username
      });
      globalChatUsers.delete(socket.id);
    }
  });
}

export { globalChatUsers };
