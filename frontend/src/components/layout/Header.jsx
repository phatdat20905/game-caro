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
    <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
          Caro Pro
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white">
          <Link to="/" className="hover:text-pink-300 transition">Phòng chơi</Link>
          <Link to="/leaderboard" className="hover:text-pink-300 transition">Bảng xếp hạng</Link>
          <Link to="/friends" className="hover:text-pink-300 transition">Bạn bè</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="text-yellow-400 font-bold hover:text-yellow-300">Admin</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} size="sm" online={user.status === 'online'} />
          <div className="text-white">
            <p className="font-medium">{user.username}</p>
            <p className="text-xs opacity-80">Điểm: {user.score}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition text-sm"
          >
            Thoát
          </button>
        </div>
      </div>
    </header>
  );
}