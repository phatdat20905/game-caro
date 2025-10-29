// src/socket/index.js
import { Server } from 'socket.io';
import { authenticateSocket } from '../middleware/auth.middleware.js';
import roomHandler from './room.socket.js';
import gameHandler from './game.socket.js';
import chatHandler from './chat.socket.js';
import voiceHandler from './voice.socket.js';
import userHandler from './user.socket.js';
import aiHandler from './ai.socket.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  // Middleware: Xác thực token
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected (socket)`);

    // Gắn user vào socket
    socket.userId = socket.user.id;

    // Xử lý các sự kiện
    userHandler(io, socket);
    roomHandler(io, socket);
    gameHandler(io, socket);
    chatHandler(io, socket);
    voiceHandler(io, socket);
    aiHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`);
    });
  });

  return io;
};