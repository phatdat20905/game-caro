// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import Avatar from '../user/Avatar.jsx';

export default function Header() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent drop-shadow-md hover:scale-105 transition-transform">
          🎮 Caro Pro
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white font-medium">
          <Link to="/" className="hover:text-pink-300 transition hover:scale-110 transform">🏠 Lobby</Link>
          <Link to="/leaderboard" className="hover:text-pink-300 transition hover:scale-110 transform">🏆 Xếp hạng</Link>
          <Link to="/friends" className="hover:text-pink-300 transition hover:scale-110 transform">👥 Bạn bè</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-yellow-400 font-bold hover:text-yellow-300 hover:scale-110 transform transition">👑 Admin</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 group">
            <Avatar src={user.avatar} size="sm" online={user.status === 'online'} />
            <div className="text-white">
              <p className="font-semibold group-hover:text-pink-300 transition">{user.username}</p>
              <p className="text-xs opacity-80">⭐ {user.score}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-white rounded-lg hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 text-sm font-semibold border border-red-500/30 hover:border-red-500/50 hover:scale-105 transform"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}