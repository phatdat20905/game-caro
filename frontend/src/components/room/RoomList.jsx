// src/components/room/RoomList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../services/socket.js';
import { useToast } from '../common/ToastContainer.jsx';
import RoomCard from './RoomCard.jsx';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const socket = getSocket();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!socket) return;

    // Request initial room list
    socket.emit('getRoomList');

    // Listen for room list updates
    socket.on('roomList', (roomList) => {
      setRooms(roomList);
      setLoading(false);
    });

    return () => {
      socket.off('roomList');
    };
  }, [socket]);

  const createRoom = () => {
    if (creating) return;
    
    setCreating(true);
    socket.emit('createRoom');

    socket.once('roomCreated', ({ roomId }) => {
      toast.success('Room created successfully! 🎉');
      navigate(`/room/${roomId}`);
      setCreating(false);
    });

    socket.once('error', (msg) => {
      toast.error(msg || 'Failed to create room');
      setCreating(false);
    });
  };

  const joinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">🎮 Game Rooms</h2>
            <p className="text-white/70">Join a room or create your own!</p>
          </div>
          
          <button
            onClick={createRoom}
            disabled={creating}
            className={`btn-primary ${creating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {creating ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Create New Room
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Rooms Available</h3>
          <p className="text-white/70 mb-6">Be the first to create a room!</p>
          <button onClick={createRoom} className="btn-primary inline-flex items-center gap-2">
            <span>🚀</span>
            Create First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <RoomCard 
              key={room.roomId} 
              room={room} 
              onJoin={() => joinRoom(room.roomId)}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {rooms.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">{rooms.length} Active Rooms</span>
            </div>
            <button 
              onClick={() => socket.emit('getRoomList')}
              className="text-white/70 hover:text-white text-sm transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
