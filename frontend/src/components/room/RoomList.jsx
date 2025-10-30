// src/components/room/RoomList.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import RoomCard from './RoomCard.jsx';
import Button from '../common/Button.jsx';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const createRoom = async () => {
    try {
      const res = await api.post('/rooms');
      window.location.href = `/room/${res.data.roomId}`;
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi tạo phòng');
    }
  };

  if (loading) return <p className="text-white text-center">Đang tải...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Danh sách phòng</h2>
        <Button onClick={createRoom}>Tạo phòng mới</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <p className="text-white col-span-full text-center">Chưa có phòng nào</p>
        ) : (
          rooms.map(room => <RoomCard key={room.roomId} room={room} />)
        )}
      </div>
    </div>
  );
}