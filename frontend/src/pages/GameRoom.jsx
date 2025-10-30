import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { getSocket } from '../services/socket.js';
import { useToast } from '../components/common/ToastContainer.jsx';
import Board from '../components/game/Board.jsx';
import ChatBox from '../components/game/ChatBox.jsx';
import VoiceChat from '../components/game/VoiceChat.jsx';
import { playWin, playLose } from '../services/sound.js';

export default function GameRoom() {
  const { roomId } = useParams();
  const { user } = useStore();
  const navigate = useNavigate();
  const socket = getSocket();
  const toast = useToast();

  const [board, setBoard] = useState(Array(15).fill(null).map(() => Array(15).fill(null)));
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState({ player1: null, player2: null });
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.emit('joinRoom', roomId);

    socket.on('gameStart', (data) => {
      console.log('Game started:', data);
      setBoard(data.board);
      setCurrentTurn(data.currentTurn);
      setIsMyTurn(data.currentTurn === user.id);
      setPlayers({
        player1: data.player1,
        player2: data.player2
      });
      toast.success('Game started! Good luck! 🎮');
    });

    socket.on('moveMade', ({ row, col, symbol, playerId, lastMove: newLastMove, nextTurn }) => {
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[row][col] = symbol;
        return newBoard;
      });
      
      setLastMove(newLastMove);
      setCurrentTurn(nextTurn);
      setIsMyTurn(nextTurn === user.id);
      
      if (playerId !== user.id) {
        toast.info('Opponent made a move');
      }
    });

    socket.on('gameOver', ({ winner: winnerId, reason, finalBoard }) => {
      setWinner(winnerId);
      setBoard(finalBoard || board);
      
      if (reason === 'checkmate') {
        if (winnerId === user.id) {
          playWin();
          toast.success('🏆 Congratulations! You won!', 5000);
        } else {
          playLose();
          toast.error('😢 You lost! Better luck next time!', 5000);
        }
      } else if (reason === 'draw') {
        toast.warning('🤝 Game ended in a draw!', 5000);
      } else if (reason === 'opponent_left') {
        playWin();
        toast.success('🏆 You won! Opponent left the game.', 5000);
      }

      // Redirect to lobby after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    socket.on('error', (msg) => {
      toast.error(msg);
    });

    socket.on('playerLeft', ({ userId, winner: winnerId, reason }) => {
      toast.warning('Opponent left the game');
      if (winnerId === user.id) {
        playWin();
        toast.success('🏆 You won by forfeit!', 5000);
        setTimeout(() => navigate('/'), 3000);
      }
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('gameStart');
      socket.off('moveMade');
      socket.off('gameOver');
      socket.off('error');
      socket.off('playerLeft');
    };
  }, [socket, roomId, user.id, navigate, toast, board]);

  const handleCellClick = (row, col) => {
    if (!isMyTurn || winner || board[row][col]) {
      if (!isMyTurn && !winner) {
        toast.warning('Wait for your turn!');
      }
      return;
    }
    
    socket.emit('makeMove', { roomId, row, col });
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white transition"
            >
              ← Back to Lobby
            </button>
            <h2 className="text-2xl font-bold text-white">Room: {roomId}</h2>
          </div>
          
          {/* Players Info */}
          <div className="flex items-center gap-6">
            {players.player1 && (
              <div className="flex items-center gap-2">
                <img src={players.player1.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-blue-400" />
                <div>
                  <p className="text-white font-semibold">{players.player1.username}</p>
                  <p className="text-xs text-white/70">Player X</p>
                </div>
              </div>
            )}
            
            <span className="text-white text-2xl">VS</span>
            
            {players.player2 && (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-white font-semibold">{players.player2.username}</p>
                  <p className="text-xs text-white/70">Player O</p>
                </div>
                <img src={players.player2.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-red-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Board */}
        <div className="lg:col-span-2">
          <div className="card flex flex-col items-center">
            <Board
              board={board}
              onCellClick={handleCellClick}
              currentTurn={isMyTurn}
              winner={winner}
              lastMove={lastMove}
              winningCells={winningCells}
            />
            
            {winner && (
              <div className="mt-6 text-center animate-bounce-subtle">
                <p className="text-3xl font-bold text-yellow-400 mb-2">
                  {winner === user.id ? '🏆 You Win!' : '😢 You Lose!'}
                </p>
                <p className="text-white/70">Returning to lobby...</p>
              </div>
            )}
            
            {!winner && (
              <div className="mt-4 text-center">
                <p className="text-white font-semibold">
                  {isMyTurn ? '✨ Your Turn' : '⏳ Waiting for opponent...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ChatBox roomId={roomId} />
          <VoiceChat roomId={roomId} />
        </div>
      </div>
    </div>
  );
}