// src/pages/Lobby.jsx
import RoomList from '../components/room/RoomList.jsx';
import QuickPlay from '../components/game/QuickPlay.jsx';
import AIMode from '../components/game/AIMode.jsx';
import GlobalChat from '../components/game/GlobalChat.jsx';

export default function Lobby() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <QuickPlay />
          <AIMode />
        </div>

        {/* Center - Room List */}
        <div className="lg:col-span-2">
          <RoomList />
        </div>

        {/* Right Sidebar - Global Chat */}
        <div className="lg:col-span-1 h-[600px]">
          <GlobalChat />
        </div>
      </div>
    </div>
  );
}
