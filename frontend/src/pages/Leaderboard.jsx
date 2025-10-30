// src/pages/Leaderboard.jsx
import { useEffect, useState } from 'react';
import { getSocket } from '../services/socket.js';
import api from '../services/api.js';

export default function Leaderboard() {
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = getSocket();

  useEffect(() => {
    // Fetch initial leaderboard
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/games/leaderboard');
        setTop(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Listen for realtime updates
    if (socket) {
      socket.on('leaderboardUpdate', (newLeaderboard) => {
        setTop(newLeaderboard);
      });
    }

    return () => {
      if (socket) {
        socket.off('leaderboardUpdate');
      }
    };
  }, [socket]);

  const getMedalEmoji = (index) => {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-300 to-gray-500';
      case 2: return 'from-orange-400 to-orange-600';
      default: return 'from-purple-400 to-purple-600';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-black text-white mb-2">Leaderboard</h1>
        <p className="text-white/70">Top 10 players ranked by score</p>
      </div>

      {/* Leaderboard List */}
      <div className="card">
        <div className="space-y-3">
          {top.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No players yet. Be the first!</p>
            </div>
          ) : (
            top.map((player, index) => (
              <div
                key={player.id}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                  ${index < 3 
                    ? `bg-gradient-to-r ${getRankColor(index)} shadow-lg transform hover:scale-105` 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                  animate-slide-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rank */}
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full font-black text-xl
                  ${index < 3 ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}
                `}>
                  {getMedalEmoji(index)}
                </div>

                {/* Avatar */}
                <img
                  src={player.avatar || '/avatars/default.png'}
                  alt={player.username}
                  className="w-14 h-14 rounded-full border-4 border-white/20 shadow-lg"
                />

                {/* Player Info */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-white'}`}>
                    {player.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/70">ID: {player.id}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-3xl font-black ${index < 3 ? 'text-white' : 'text-yellow-400'}`}>
                    {player.score}
                  </div>
                  <div className="text-xs text-white/70 mt-1">points</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-white">{top.length}</div>
            <div className="text-sm text-white/70">Total Players</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">
              {top[0]?.score || 0}
            </div>
            <div className="text-sm text-white/70">Highest Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">
              {top.reduce((sum, p) => sum + p.score, 0)}
            </div>
            <div className="text-sm text-white/70">Total Score</div>
          </div>
        </div>
      </div>

      {/* Live Update Indicator */}
      <div className="card">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white/70 text-sm">Live updates enabled</span>
        </div>
      </div>
    </div>
  );
}