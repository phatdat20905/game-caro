// src/socket/ai.socket.js
import { makeAIMove } from "../services/ai.service.js";

const aiRooms = {}; // { roomId: { board, playerSymbol } }

export default (io, socket) => {
  // Khi người chơi bắt đầu chơi với AI
  socket.on("startAIGame", () => {
    const roomId = `ai_${socket.id}_${Date.now()}`;
    const board = Array(15)
      .fill()
      .map(() => Array(15).fill(null));

    aiRooms[roomId] = { board, playerSymbol: "X" };
    socket.join(roomId);

    socket.emit("aiGameStarted", { roomId, board, yourTurn: true });
  });

  // Khi người chơi đánh 1 nước
  socket.on("aiMove", ({ roomId, row, col }) => {
    const room = aiRooms[roomId];
    if (!room || room.board[row][col] !== null) return;

    room.board[row][col] = "X";
    io.to(roomId).emit("moveMade", { row, col, symbol: "X" });

    // Máy đánh sau 0.5s
    setTimeout(() => {
      const aiMove = makeAIMove(room.board, "O");
      if (aiMove) {
        room.board[aiMove.row][aiMove.col] = "O";
        io.to(roomId).emit("moveMade", aiMove);
      }
    }, 500);
  });
};
