// src/components/room/RoomCard.jsx
import { useNavigate } from 'react-router-dom';
import Avatar from '../user/Avatar.jsx';
import Button from '../common/Button.jsx';

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 hover:bg-white/20 transition">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">Ph本次: {room.roomId}</h3>
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
          {room.status === 'waiting' ? 'Đang chờ' : 'Đang chơi'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar src={room.Player1.avatar} size="sm" online />
        <span className="text-white font-medium">{room.Player1.username}</span>
      </div>
      <Button
        onClick={() => navigate(`/room/${room.roomId}`)}
        className="mt-3 w-full"
        disabled={room.status !== 'waiting'}
      >
        {room.status === 'waiting' ? 'Vào chơi' : 'Đầy'}
      </Button>
    </div>
  );
}