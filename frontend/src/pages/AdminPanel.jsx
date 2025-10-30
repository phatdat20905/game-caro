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

  useEffect(() => {
    if (user.role !== 'admin') return;
    api.get('/admin/online').then(res => setOnline(res.data));
    api.get('/users/all').then(res => setAllUsers(res.data));
  }, [user]);

  const banUser = async () => {
    await api.post('/admin/ban', { userId: banId, reason, days: days || null });
    alert('Đã cấm người chơi');
  };

  if (user.role !== 'admin') return <p className="text-white">Không có quyền</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Người online ({online.length})</h2>
        <div className="grid grid-cols-3 gap-3">
          {online.map(u => (
            <div key={u.id} className="bg-white/5 p-3 rounded-lg text-white">
              {u.username}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Cấm người chơi</h2>
        <div className="space-y-3">
          <input placeholder="ID người chơi" value={banId} onChange={e => setBanId(e.target.value)} className="w-full px-4 py-2 rounded-lg" />
          <input placeholder="Lý do" value={reason} onChange={e => setReason(e.target.value)} className="w-full px-4 py-2 rounded-lg" />
          <input placeholder="Số ngày (tùy chọn)" value={days} onChange={e => setDays(e.target.value)} className="w-full px-4 py-2 rounded-lg" />
          <button onClick={banUser} className="w-full py-2 bg-red-600 text-white rounded-lg">Cấm</button>
        </div>
      </div>
    </div>
  );
}