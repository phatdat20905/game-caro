// src/components/game/AIMode.jsx
import { useEffect, useState } from 'react';
import { getSocket } from '../../services/socket.js';
import Board from './Board.jsx';

export default function AIMode() {
  const [roomId, setRoomId] = useState(null);
  const [board, setBoard] = useState(Array(15).fill().map(() => Array(15).fill(null)));
  const socket = getSocket();

  useEffect(() => {
    socket.emit('startAIGame');
    socket.on('aiGameStarted', ({ roomId: id, board: b }) => {
      setRoomId(id);
      setBoard(b);
    });
    socket.on('moveMade', ({ row, col, symbol }) => {
      setBoard(prev => {
        const newB = [...prev];
        newB[row][col] = symbol;
        return newB;
      });
    });
    return () => socket.off();
  }, [socket]);

  const handleMove = (row, col) => {
    if (board[row][col]) return;
    socket.emit('aiMove', { roomId, row, col });
  };

  if (!roomId) return <p className="text-white">Đang kết nối với AI...</p>;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Chơi với AI</h2>
      <Board board={board} onCellClick={handleMove} currentTurn />
    </div>
  );
}