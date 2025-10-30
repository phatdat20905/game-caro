// src/socket/quickplay.socket.js
import db from '../models/index.js';
import { initRoom } from './game.socket.js';

const { Room, User } = db;

// Queue for waiting players
const quickPlayQueue = [];

/**
 * Quick Play - Auto-match system
 */
export default (io, socket) => {
  /**
   * Join quick play queue
   */
  socket.on('joinQuickPlay', async () => {
    try {
      // Check if already in queue
      if (quickPlayQueue.some(s => s.id === socket.id)) {
        return socket.emit('error', 'Already in quick play queue');
      }

      // Check if there's someone waiting
      if (quickPlayQueue.length > 0) {
        const opponent = quickPlayQueue.shift();
        
        // Make sure opponent is still connected
        if (!opponent.connected) {
          // Opponent disconnected, try again
          return socket.emit('joinQuickPlay');
        }

        // Create a game room
        const roomId = `QP_${Date.now().toString(36).toUpperCase()}`;
        
        // Save to database
        await Room.create({
          roomId,
          player1Id: opponent.user.id,
          player2Id: socket.user.id,
          status: 'playing'
        });

        // Update user statuses
        await User.update({ status: 'in-game' }, {
          where: { id: [opponent.user.id, socket.user.id] }
        });

        // Join both to room
        opponent.join(roomId);
        socket.join(roomId);

        // Initialize game state
        initRoom(roomId, opponent, socket, opponent.user.id, socket.user.id);

        // Get player details
        const player1 = await User.findByPk(opponent.user.id, {
          attributes: ['id', 'username', 'avatar']
        });
        const player2 = await User.findByPk(socket.user.id, {
          attributes: ['id', 'username', 'avatar']
        });

        // Notify both players
        const gameData = {
          roomId,
          board: Array(15).fill(null).map(() => Array(15).fill(null)),
          currentTurn: opponent.user.id,
          player1: {
            id: player1.id,
            username: player1.username,
            avatar: player1.avatar,
            symbol: 'X'
          },
          player2: {
            id: player2.id,
            username: player2.username,
            avatar: player2.avatar,
            symbol: 'O'
          }
        };

        io.to(roomId).emit('quickPlayMatch', gameData);
        io.to(roomId).emit('gameStart', gameData);

        console.log(`✅ Quick Play Match: ${player1.username} vs ${player2.username} in ${roomId}`);

      } else {
        // No one waiting, add to queue
        quickPlayQueue.push(socket);
        socket.emit('quickPlayWaiting', { position: quickPlayQueue.length });
        
        console.log(`⏳ ${socket.user.username} joined quick play queue (${quickPlayQueue.length} waiting)`);
      }
    } catch (error) {
      console.error('Quick play error:', error);
      socket.emit('error', 'Failed to join quick play');
    }
  });

  /**
   * Leave quick play queue
   */
  socket.on('leaveQuickPlay', () => {
    const index = quickPlayQueue.findIndex(s => s.id === socket.id);
    if (index !== -1) {
      quickPlayQueue.splice(index, 1);
      socket.emit('quickPlayLeft');
      console.log(`❌ ${socket.user.username} left quick play queue`);
    }
  });

  /**
   * Get queue status
   */
  socket.on('getQuickPlayStatus', () => {
    const position = quickPlayQueue.findIndex(s => s.id === socket.id);
    socket.emit('quickPlayStatus', {
      inQueue: position !== -1,
      position: position + 1,
      queueLength: quickPlayQueue.length
    });
  });
};

// Clean up disconnected players from queue
export const cleanupQuickPlayQueue = (socketId) => {
  const index = quickPlayQueue.findIndex(s => s.id === socketId);
  if (index !== -1) {
    quickPlayQueue.splice(index, 1);
    console.log(`🧹 Cleaned up disconnected socket from quick play queue`);
  }
};
