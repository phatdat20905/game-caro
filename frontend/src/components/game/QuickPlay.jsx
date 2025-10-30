// src/components/game/QuickPlay.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../services/socket.js';
import { useToast } from '../common/ToastContainer.jsx';

export default function QuickPlay() {
  const [searching, setSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const socket = getSocket();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!socket) return;

    socket.on('quickPlayWaiting', ({ position }) => {
      setQueuePosition(position);
      toast.info(`Finding opponent... (${position} in queue)`);
    });

    socket.on('quickPlayMatch', ({ roomId, player1, player2 }) => {
      toast.success('Match found! Starting game... 🎮');
      setSearching(false);
      
      // Navigate to game room after a short delay
      setTimeout(() => {
        navigate(`/room/${roomId}`);
      }, 1000);
    });

    socket.on('quickPlayLeft', () => {
      setSearching(false);
      setQueuePosition(0);
      toast.info('Left quick play queue');
    });

    socket.on('error', (msg) => {
      setSearching(false);
      toast.error(msg);
    });

    return () => {
      socket.off('quickPlayWaiting');
      socket.off('quickPlayMatch');
      socket.off('quickPlayLeft');
    };
  }, [socket, navigate, toast]);

  const startQuickPlay = () => {
    if (!socket) {
      toast.error('Not connected to server');
      return;
    }

    setSearching(true);
    socket.emit('joinQuickPlay');
    toast.info('Searching for opponent... ⏳');
  };

  const cancelQuickPlay = () => {
    if (socket) {
      socket.emit('leaveQuickPlay');
    }
    setSearching(false);
    setQueuePosition(0);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-3xl font-bold text-white mb-2">Quick Play</h2>
        <p className="text-white/70">Auto-match with a random opponent</p>
      </div>

      {/* Searching Animation */}
      {searching && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-8 mb-6 border-2 border-purple-500/50 animate-pulse-slow">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Searching for opponent...</h3>
            {queuePosition > 0 && (
              <p className="text-white/70">Position in queue: #{queuePosition}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!searching ? (
        <button
          onClick={startQuickPlay}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🎮</span>
          <span className="text-lg">Find Match</span>
        </button>
      ) : (
        <button
          onClick={cancelQuickPlay}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">❌</span>
          <span className="text-lg">Cancel Search</span>
        </button>
      )}

      {/* Info */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">How it works:</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Click "Find Match" to join the queue</li>
              <li>• System will auto-match you with another player</li>
              <li>• Game starts immediately when match found</li>
              <li>• First player gets X, second gets O</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">⚡</div>
          <div className="text-xs text-white/70 mt-1">Fast Matching</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">🎯</div>
          <div className="text-xs text-white/70 mt-1">Fair Matchmaking</div>
        </div>
      </div>
    </div>
  );
}
