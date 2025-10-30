import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { getSocket } from '../services/socket.js';
import Board from '../components/game/Board.jsx';
import ChatBox from '../components/game/ChatBox.jsx';
import VoiceChat from '../components/game/VoiceChat.jsx';
import api from '../services/api.js';

export default function GameRoom() {
  const { roomId } = useParams();
  const { user } = useStore();
  const navigate = useNavigate();
  const socket = getSocket();

  const [board, setBoard] = useState(Array(15).fill().map(() => Array(15).fill(null)));
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState({ player1: null, player2: null });
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit('joinRoom', roomId);

    socket.on('gameStart', (data) => {
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setIsMyTurn(data.currentTurn === user.id);
    });

    socket.on('moveMade', ({ row, col, symbol }) => {
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[row][col] = symbol;
        return newBoard;
      });
      setIsMyTurn(prev => !prev);
    });

    socket.on('gameOver', ({ winner: winId }) => {
      setWinner(winId);
    });

    socket.on('error', (msg) => {
      alert(msg);
      navigate('/');
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('gameStart');
      socket.off('moveMade');
      socket.off('gameOver');
      socket.off('error');
    };
  }, [socket, roomId, user.id, navigate]);

  const handleCellClick = (row, col) => {
    if (!isMyTurn || winner || board[row][col]) return;
    socket.emit('makeMove', { roomId, row, col });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Phòng: {roomId}</h2>
            <Board
              board={board}
              onCellClick={handleCellClick}
              currentTurn={isMyTurn}
              winner={winner}
            />
            {winner && (
              <p className="text-center mt-4 text-xl font-bold text-yellow-400">
                {winner === user.id ? 'Bạn thắng!' : 'Bạn thua!'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: Chat + Voice + Players */}
        <div className="space-y-4">
          <ChatBox roomId={roomId} />
          <VoiceChat roomId={roomId} />
        </div>
      </div>
    </div>
  );
}