// src/socket/game.socket.js
import { checkWin, saveGame } from '../services/game.service.js';
import db from '../models/index.js';

const { User, Room } = db;

// In-memory rooms state
const rooms = {};

/**
 * Initialize room state when game starts
 */
const initRoom = (roomId, player1Socket, player2Socket, player1Id, player2Id) => {
  rooms[roomId] = {
    players: [player1Socket, player2Socket],
    spectators: [],
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    moves: [],
    currentTurn: player1Id,
    player1Id,
    player2Id,
    lastMove: null
  };
};

export default (io, socket) => {
  /**
   * Make a move in the game
   */
  socket.on('makeMove', async ({ roomId, row, col }) => {
    try {
      const room = rooms[roomId];
      
      // Validate room exists
      if (!room) {
        return socket.emit('error', 'Room not found');
      }

      // Validate player is in room
      const playerIndex = room.players.findIndex(s => s.id === socket.id);
      if (playerIndex === -1) {
        return socket.emit('error', 'You are not in this game');
      }

      // Validate it's player's turn
      if (room.currentTurn !== socket.user.id) {
        return socket.emit('error', 'Not your turn');
      }

      // Validate cell is empty
      if (room.board[row][col] !== null) {
        return socket.emit('error', 'Cell already occupied');
      }

      // Make the move
      const symbol = playerIndex === 0 ? 'X' : 'O';
      room.board[row][col] = symbol;
      room.lastMove = { row, col };
      
      // Record move
      room.moves.push({
        row,
        col,
        symbol,
        playerId: socket.user.id,
        timestamp: new Date()
      });

      // Toggle turn
      room.currentTurn = room.currentTurn === room.player1Id 
        ? room.player2Id 
        : room.player1Id;

      // Emit move to all in room (including spectators)
      io.to(roomId).emit('moveMade', { 
        row, 
        col, 
        symbol,
        playerId: socket.user.id,
        lastMove: { row, col },
        nextTurn: room.currentTurn
      });

      // Check for winner
      const isWin = checkWin(room.board, row, col, symbol);
      
      if (isWin) {
        // Winner found
        const winnerId = socket.user.id;
        const loserId = room.currentTurn; // The one who didn't win

        // Save game to database
        await saveGame({
          player1Id: room.player1Id,
          player2Id: room.player2Id,
          winnerId,
          moves: JSON.stringify(room.moves)
        });

        // Update scores
        await User.increment('score', { by: 10, where: { id: winnerId } });
        await User.decrement('score', { by: 5, where: { id: loserId } });

        // Update user statuses
        await User.update({ status: 'online' }, { 
          where: { id: [room.player1Id, room.player2Id] } 
        });

        // Emit game over
        io.to(roomId).emit('gameOver', { 
          winner: winnerId,
          loser: loserId,
          reason: 'checkmate',
          finalBoard: room.board
        });

        // Emit leaderboard update
        const topPlayers = await User.findAll({
          attributes: ['id', 'username', 'avatar', 'score'],
          where: { isBanned: false },
          order: [['score', 'DESC']],
          limit: 10
        });
        io.emit('leaderboardUpdate', topPlayers);

        // Clean up room
        const dbRoom = await Room.findOne({ where: { roomId } });
        if (dbRoom) await dbRoom.update({ status: 'finished' });
        
        setTimeout(() => {
          delete rooms[roomId];
        }, 5000); // Keep room for 5 seconds for final state

      } else if (room.board.flat().every(cell => cell !== null)) {
        // Draw - board is full
        await saveGame({
          player1Id: room.player1Id,
          player2Id: room.player2Id,
          winnerId: null,
          moves: JSON.stringify(room.moves)
        });

        // Update user statuses
        await User.update({ status: 'online' }, { 
          where: { id: [room.player1Id, room.player2Id] } 
        });

        io.to(roomId).emit('gameOver', { 
          winner: null,
          reason: 'draw',
          finalBoard: room.board
        });

        // Clean up
        const dbRoom = await Room.findOne({ where: { roomId } });
        if (dbRoom) await dbRoom.update({ status: 'finished' });
        
        setTimeout(() => {
          delete rooms[roomId];
        }, 5000);
      }

    } catch (error) {
      console.error('Make move error:', error);
      socket.emit('error', 'Failed to make move');
    }
  });

  /**
   * Send chat message in room
   */
  socket.on('sendMessage', ({ roomId, message }) => {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit('newMessage', {
      userId: socket.user.id,
      username: socket.user.username,
      message,
      timestamp: new Date()
    });
  });
};

// Export for use in room.socket.js
export { rooms, initRoom };