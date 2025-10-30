// src/pages/Lobby.jsx
import RoomList from '../components/room/RoomList.jsx';
import AIMode from '../components/game/AIMode.jsx';

export default function Lobby() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <section>
        <RoomList />
      </section>
      <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
        <AIMode />
      </section>
    </div>
  );
}