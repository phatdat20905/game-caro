// src/pages/Lobby.jsx
import RoomList from '../components/room/RoomList.jsx';
import AIMode from '../components/game/AIMode.jsx';
export default function Lobby() {
  return (
    <>
      <div className="max-w-6xl mx-auto">
        <RoomList />
      </div>
      <div className="mt-8">
        <AIMode />
      </div>
    </>
  );
}