// src/pages/AdminPanel.jsx
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useStore } from '../store/useStore.js';

export default function AdminPanel() {
  const { user } = useStore();
  const [online, setOnline] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [banId, setBanId] = useState('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');

  // BẢO VỆ: Nếu user null → Không làm gì
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    api.get('/admin/online')
      .then(res => setOnline(res.data))
      .catch(() => setOnline([]));

    api.get('/users/all')
      .then(res => setAllUsers(res.data))
      .catch(() => setAllUsers([]));
  }, [user]);

  const banUser = async () => {
    if (!banId) return alert('Vui lòng nhập ID');
    try {
      await api.post('/admin/ban', { userId: banId, reason, days: days ? Number(days) : null });
      alert('Đã cấm người chơi');
      setBanId('');
      setReason('');
      setDays('');
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi cấm người chơi');
    }
  };

  // BẢO VỆ: Nếu chưa login hoặc không phải admin → Hiển thị thông báo
  if (!user) {
    return <p className="text-white text-center">Đang tải...</p>;
  }

  if (user.role !== 'admin') {
    return <p className="text-white text-center">Bạn không có quyền truy cập trang này</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          Người online ({online.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {online.length === 0 ? (
            <p className="text-white/70 col-span-full text-center">Không có ai online</p>
          ) : (
            online.map(u => (
              <div key={u.id} className="bg-white/5 p-3 rounded-lg text-white text-sm text-center">
                {u.username}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Cấm người chơi</h2>
        <div className="space-y-3">
          <input
            placeholder="ID người chơi"
            value={banId}
            onChange={e => setBanId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
          />
          <input
            placeholder="Lý do"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
          />
          <input
            placeholder="Số ngày (tùy chọn)"
            value={days}
            onChange={e => setDays(e.target.value)}
            type="number"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50"
          />
          <button
            onClick={banUser}
            className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cấm người chơi
          </button>
        </div>
      </div>
    </div>
  );
}