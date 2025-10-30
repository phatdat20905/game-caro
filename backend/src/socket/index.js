// src/socket/index.js
import { Server } from 'socket.io';
import { authenticateSocket } from '../middleware/auth.middleware.js';
import roomHandler from './room.socket.js';
import gameHandler from './game.socket.js';
import chatHandler from './chat.socket.js';
import voiceHandler from './voice.socket.js';
import userHandler from './user.socket.js';
import aiHandler from './ai.socket.js';
import quickplayHandler, { cleanupQuickPlayQueue } from './quickplay.socket.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'], // Chỉ cho phép frontend
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.user.username} connected (ID: ${socket.id})`);

    socket.userId = socket.user.id;

    // Register all socket handlers
    userHandler(io, socket);
    roomHandler(io, socket);
    gameHandler(io, socket);
    chatHandler(io, socket);
    voiceHandler(io, socket);
    aiHandler(io, socket);
    quickplayHandler(io, socket);

    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.user.username} disconnected`);
      cleanupQuickPlayQueue(socket.id);
    });
  });

  return io;
};