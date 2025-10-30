// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import Header from './components/layout/Header.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Lobby from './pages/Lobby.jsx';
import GameRoom from './pages/GameRoom.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Friends from './pages/Friends.jsx';
import Replay from './pages/Replay.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

function ProtectedRoute({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user } = useStore();
  return user ? <Navigate to="/" replace /> : children;
}

function App() {
  const { user } = useStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        {user && <Header />}
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            
            {/* Người dùng đã login */}
            <Route path="/" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
            <Route path="/room/:roomId" element={<ProtectedRoute><GameRoom /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/replay/:gameId" element={<ProtectedRoute><Replay /></ProtectedRoute>} />

            {/* CHỈ ADMIN MỚI VÀO ĐƯỢC */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;