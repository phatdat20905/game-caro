// src/pages/Friends.jsx
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Avatar from '../components/user/Avatar.jsx';
import Button from '../components/common/Button.jsx';

export default function Friends() {
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const fetchFriends = async () => {
    const res = await api.get('/friends');
    setFriends(res.data.map(f => f.FriendUser));
  };

  const fetchRequests = async () => {
    const res = await api.get('/friends/requests');
    setRequests(res.data);
  };

  const searchUsers = async () => {
    if (search.length < 2) return setResults([]);
    const res = await api.get(`/users/search?q=${search}`);
    setResults(res.data);
  };

  const sendRequest = async (userId) => {
    await api.post('/friends/send', { username: results.find(u => u.id === userId).username });
    setResults(prev => prev.filter(u => u.id !== userId));
  };

  const acceptRequest = async (requestId) => {
    await api.post(`/friends/accept/${requestId}`);
    fetchRequests();
    fetchFriends();
  };

  useEffect(() => {
    if (tab === 'friends') fetchFriends();
    if (tab === 'requests') fetchRequests();
  }, [tab]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTab('friends')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'friends' ? 'bg-purple-600 text-white' : 'text-white/70'}`}>Bạn bè</button>
          <button onClick={() => setTab('requests')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'requests' ? 'bg-purple-600 text-white' : 'text-white/70'}`}>Lời mời</button>
          <button onClick={() => setTab('add')} className={`px-4 py-2 rounded-lg font-semibold ${tab === 'add' ? 'bg-purple-600 text-white' : 'text-white/70'}`}>Thêm bạn</button>
        </div>

        {tab === 'friends' && (
          <div className="space-y-3">
            {friends.map(f => (
              <div key={f.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar src={f.avatar} online={f.status === 'online'} />
                  <div>
                    <p className="font-medium text-white">{f.username}</p>
                    <p className="text-xs text-white/60">{f.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'requests' && (
          <div className="space-y-3">
            {requests.map(r => (
              <div key={r.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar src={r.From.avatar} />
                  <p className="text-white font-medium">{r.From.username}</p>
                </div>
                <Button onClick={() => acceptRequest(r.id)} size="sm">Chấp nhận</Button>
              </div>
            ))}
          </div>
        )}

        {tab === 'add' && (
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm người chơi..."
              value={search}
              onChange={e => { setSearch(e.target.value); searchUsers(); }}
              className="w-full px-4 py-2 rounded-lg mb-3"
            />
            <div className="space-y-2">
              {results.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} online={u.status === 'online'} />
                    <p className="text-white">{u.username}</p>
                  </div>
                  <Button onClick={() => sendRequest(u.id)} size="sm">Gửi lời mời</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}