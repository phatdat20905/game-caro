// src/socket/game.socket.js
import { checkWin } from '../services/game.service.js';

export default (io, socket) => {
  socket.on('makeMove', ({ roomId, row, col }) => {
    const room = rooms[roomId];
    if (!room || !room.players.includes(socket)) return;

    const board = room.board;
    if (board[row][col] !== null) return;

    const playerIndex = room.players.findIndex(s => s.id === socket.id);
    const symbol = playerIndex === 0 ? 'X' : 'O';
    board[row][col] = symbol;

    const winner = checkWin(board, row, col, symbol);
    io.to(roomId).emit('moveMade', { row, col, symbol });

    if (winner) {
      io.to(roomId).emit('gameOver', { winner: socket.user.id });
      delete rooms[roomId];
    } else if (board.flat().every(cell => cell !== null)) {
      io.to(roomId).emit('gameOver', { winner: null });
    }
  });
};