// src/components/room/RoomCard.jsx

export default function RoomCard({ room, onJoin }) {
  const getTimeAgo = (date) => {
    if (!date) return 'just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="card-hover group">
      {/* Room Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-white">{room.roomId}</h3>
          </div>
          <p className="text-xs text-white/50">{getTimeAgo(room.createdAt)}</p>
        </div>
        
        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          1/2 Players
        </span>
      </div>

      {/* Player Info */}
      <div className="bg-white/5 rounded-lg p-3 mb-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img 
            src={room.player1?.avatar || '/avatars/default.png'} 
            alt="Player" 
            className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg"
          />
          <div className="flex-1">
            <p className="text-white font-semibold">{room.player1?.username || 'Player 1'}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-blue-400 text-sm font-bold">X</span>
              <span className="text-white/50 text-xs">• Waiting for opponent...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <button
        onClick={onJoin}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-xl">🎮</span>
        <span>Join Game</span>
      </button>
    </div>
  );
}
