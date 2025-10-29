// src/socket/chat.socket.js
export default (io, socket) => {
  socket.on('sendMessage', ({ roomId, message }) => {
    const msg = { user: socket.user.username, message, timestamp: new Date() };
    io.to(roomId).emit('newMessage', msg);
  });
};