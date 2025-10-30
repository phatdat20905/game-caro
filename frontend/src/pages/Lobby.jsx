// src/pages/Lobby.jsx
import RoomList from '../components/room/RoomList.jsx';
import QuickPlay from '../components/game/QuickPlay.jsx';
import AIMode from '../components/game/AIMode.jsx';

export default function Lobby() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Quick Play Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RoomList />
        </div>
        <div className="space-y-6">
          <QuickPlay />
          <AIMode />
        </div>
      </div>
    </div>
  );
}
