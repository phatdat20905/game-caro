// src/pages/Leaderboard.jsx
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Avatar from '../components/user/Avatar.jsx';

export default function Leaderboard() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    api.get('/games/leaderboard').then(res => setTop(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Bảng Xếp Hạng</h2>
        <div className="space-y-3">
          {top.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between p-4 rounded-lg ${i === 0 ? 'bg-yellow-500/20' : i === 1 ? 'bg-gray-400/20' : i === 2 ? 'bg-orange-600/20' : 'bg-white/5'}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white w-8">{i + 1}</span>
                <Avatar src={p.avatar} />
                <p className="font-semibold text-white">{p.username}</p>
              </div>
              <p className="text-xl font-bold text-yellow-400">{p.score} điểm</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}