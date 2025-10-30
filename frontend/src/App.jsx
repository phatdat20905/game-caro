// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import api from './services/api.js';
import Header from './components/layout/Header.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Lobby from './pages/Lobby.jsx';
import GameRoom from './pages/GameRoom.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Friends from './pages/Friends.jsx';
import Replay from './pages/Replay.jsx';
// import AdminPanel from './pages/AdminPanel.jsx';

function ProtectedRoute({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const { user } = useStore();
  return user ? <Navigate to="/" replace /> : children;
}

function AutoLogin() {
  const { login } = useStore();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token && !login) {
      api.get('/users/me')
        .then(res => {
          login(res.data, token);
          navigate('/');
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
        });
    }
  }, [token, login, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AutoLogin />
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <Header />
        <div className="container mx-auto px-4 py-6 flex gap-6">
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
              <Route path="/" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
              <Route path="/room/:roomId" element={<ProtectedRoute><GameRoom /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/replay/:gameId" element={<ProtectedRoute><Replay /></ProtectedRoute>} />
              {/* <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;