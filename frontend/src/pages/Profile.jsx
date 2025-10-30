// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import Avatar from '../components/user/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import { useToast } from '../components/common/ToastContainer.jsx';
import { useStore } from '../store/useStore.js';

export default function Profile() {
  const { user, setUser } = useStore();
  const [stats, setStats] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'default.png');
  const toast = useToast();
  const navigate = useNavigate();

  const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png', 'default.png'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [statsRes, gamesRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/users/games')
      ]);
      setStats(statsRes.data);
      setGames(gamesRes.data);
    } catch (err) {
      toast.error('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async () => {
    try {
      await api.put('/users/avatar', { avatar: selectedAvatar });
      setUser({ ...user, avatar: selectedAvatar });
      setEditMode(false);
      toast.success('Đã cập nhật avatar!');
    } catch (err) {
      toast.error('Không thể cập nhật avatar');
    }
  };

  const getResultBadge = (game) => {
    if (game.winner === null) return { text: 'Hòa', color: 'bg-gray-500', emoji: '🤝' };
    if (game.winner === user.id) return { text: 'Thắng', color: 'bg-green-500', emoji: '🏆' };
    return { text: 'Thua', color: 'bg-red-500', emoji: '😢' };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  const winRate = stats ? ((stats.wins / (stats.totalGames || 1)) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
              <img 
                src={`/avatars/${selectedAvatar}`} 
                alt={user?.username}
                className="w-full h-full rounded-full bg-gray-800"
              />
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              ✏️
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.username}
            </h1>
            <p className="text-purple-300 text-lg mb-4">
              {user?.role === 'admin' ? '👑 Administrator' : '🎮 Player'}
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">{stats?.totalGames || 0}</div>
                <div className="text-xs text-white/70">Trận đấu</div>
              </div>
              <div className="bg-green-500/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-400">{stats?.wins || 0}</div>
                <div className="text-xs text-white/70">Thắng</div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-400">{stats?.losses || 0}</div>
                <div className="text-xs text-white/70">Thua</div>
              </div>
              <div className="bg-yellow-500/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-3xl font-bold text-yellow-400">{winRate}%</div>
                <div className="text-xs text-white/70">Tỷ lệ thắng</div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-xl">
              <div className="text-5xl font-bold text-white">{user?.score || 1000}</div>
              <div className="text-sm text-white/90 font-semibold">ELO Rating</div>
            </div>
          </div>
        </div>

        {/* Avatar Selector */}
        {editMode && (
          <div className="mt-6 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 animate-fadeIn">
            <h3 className="text-white font-semibold mb-4">Chọn avatar mới</h3>
            <div className="grid grid-cols-6 gap-4 mb-4">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-full overflow-hidden transition-all duration-300 transform hover:scale-110 ${
                    selectedAvatar === avatar 
                      ? 'ring-4 ring-purple-500 scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={`/avatars/${avatar}`} alt={avatar} className="w-full h-full bg-gray-800" />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={updateAvatar} className="flex-1">
                💾 Lưu thay đổi
              </Button>
              <Button onClick={() => setEditMode(false)} variant="secondary" className="flex-1">
                ❌ Hủy
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Match History */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          📜 Lịch sử đấu
          <span className="text-sm font-normal text-white/60">({games.length} trận)</span>
        </h2>

        {games.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p className="text-6xl mb-4">🎮</p>
            <p className="text-lg">Chưa có trận đấu nào</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Bắt đầu chơi ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => {
              const result = getResultBadge(game);
              const opponent = game.player1.id === user.id ? game.player2 : game.player1;
              
              return (
                <div 
                  key={game.id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 border border-white/5 hover:border-white/20 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Result Badge */}
                      <div className={`${result.color} rounded-lg px-4 py-2 text-white font-bold text-center min-w-[80px]`}>
                        <div className="text-2xl">{result.emoji}</div>
                        <div className="text-xs">{result.text}</div>
                      </div>

                      {/* Opponent Info */}
                      <div className="flex items-center gap-3">
                        <Avatar src={opponent?.avatar} size="sm" />
                        <div>
                          <p className="text-white font-semibold">
                            vs {opponent?.username || 'AI'}
                          </p>
                          <p className="text-xs text-white/60">
                            {formatDate(game.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className="hidden md:flex items-center gap-6 text-white/70 text-sm">
                        <div>
                          <span className="text-white/50">Số nước:</span>{' '}
                          <span className="text-white font-semibold">
                            {game.moves ? JSON.parse(game.moves).length : 0}
                          </span>
                        </div>
                        {game.winner && (
                          <div>
                            <span className="text-white/50">Điểm:</span>{' '}
                            <span className={`font-semibold ${
                              game.winner === user.id ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {game.winner === user.id ? '+10' : '-5'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Replay Button */}
                    <Button
                      onClick={() => navigate(`/replay/${game.id}`)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      🎬 Xem lại
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
