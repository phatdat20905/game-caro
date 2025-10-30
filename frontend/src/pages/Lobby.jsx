// src/pages/Lobby.jsx
import { useStore } from '../store/useStore.js';

export default function Lobby() {
  const { user } = useStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          Chào mừng, {user.username}!
        </h1>
        <p className="text-gray-600 mb-8">Bạn đã đăng nhập thành công</p>
        <div className="bg-gray-100 rounded-lg p-6">
          <p className="text-sm text-gray-500">Sẵn sàng chơi?</p>
          <button className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
            Vào phòng chơi
          </button>
        </div>
      </div>
    </div>
  );
}