// src/pages/Replay.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import Board from '../components/game/Board.jsx';

export default function Replay() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);

  useEffect(() => {
    api.get(`/replay/${gameId}`).then(res => {
      setGame(res.data);
      setMoves(JSON.parse(res.data.moves));
    });
  }, [gameId]);

  useEffect(() => {
    if (moves.length === 0) return;
    const timer = setTimeout(() => {
      if (currentMove < moves.length) {
        setCurrentMove(prev => prev + 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentMove, moves]);

  if (!game) return <p className="text-white">Đang tải...</p>;

  const board = Array(15).fill().map(() => Array(15).fill(null));
  for (let i = 0; i < currentMove; i++) {
    const { row, col, symbol } = moves[i];
    board[row][col] = symbol;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Xem lại: {game.Player1.username} vs {game.Player2.username}</h2>
      <Board board={board} />
      <div className="mt-4 text-white text-center">
        Nước {currentMove}/{moves.length}
      </div>
    </div>
  );
}