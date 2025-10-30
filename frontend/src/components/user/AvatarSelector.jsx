// src/components/user/AvatarSelector.jsx
import { useState } from 'react';
import api from '../../services/api.js';

const avatars = Array.from({ length: 10 }, (_, i) => `/avatars/avatar${i + 1}.png`).concat(['/avatars/default.png']);

export default function AvatarSelector({ current, onChange }) {
  const [selected, setSelected] = useState(current);

  const save = async () => {
    await api.post('/users/update-avatar', { avatar: selected });
    onChange(selected);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {avatars.map(a => (
          <img
            key={a}
            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${a}`}
            className={`w-16 h-16 rounded-full cursor-pointer border-4 ${selected === a ? 'border-purple-500' : 'border-white/20'}`}
            onClick={() => setSelected(a)}
          />
        ))}
      </div>
      <button onClick={save} className="w-full py-2 bg-purple-600 text-white rounded-lg">Lưu</button>
    </div>
  );
}