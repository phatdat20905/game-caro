// src/pages/Friends.jsx
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Avatar from '../components/user/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import { useToast } from '../components/common/ToastContainer.jsx';

export default function Friends() {
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const toast = useToast();

  const fetchFriends = async () => {
    try {
      const res = await api.get('/friends');
      setFriends(res.data.map(f => f.FriendUser));
    } catch (err) {
      toast.error('Không thể tải danh sách bạn bè');
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/friends/requests');
      setRequests(res.data);
    } catch (err) {
      toast.error('Không thể tải lời mời kết bạn');
    }
  };

  const searchUsers = async () => {
    if (search.length < 2) return setResults([]);
    try {
      const res = await api.get(`/users/search?q=${search}`);
      setResults(res.data);
    } catch (err) {
      toast.error('Lỗi tìm kiếm');
    }
  };

  const sendRequest = async (userId) => {
    try {
      const username = results.find(u => u.id === userId).username;
      await api.post('/friends/send', { username });
      setResults(prev => prev.filter(u => u.id !== userId));
      toast.success(`Đã gửi lời mời kết bạn tới ${username}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Không thể gửi lời mời');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/friends/accept/${requestId}`);
      fetchRequests();
      fetchFriends();
      toast.success('Đã chấp nhận lời mời kết bạn');
    } catch (err) {
      toast.error('Không thể chấp nhận lời mời');
    }
  };

  const declineRequest = async (requestId) => {
    try {
      await api.post(`/friends/decline/${requestId}`);
      fetchRequests();
      toast.info('Đã từ chối lời mời kết bạn');
    } catch (err) {
      toast.error('Không thể từ chối lời mời');
    }
  };

  const removeFriend = async (friendId, friendName) => {
    if (!confirm(`Bạn có chắc muốn xóa ${friendName} khỏi danh sách bạn bè?`)) return;
    
    try {
      await api.delete(`/friends/${friendId}`);
      fetchFriends();
      toast.success(`Đã xóa ${friendName} khỏi danh sách bạn bè`);
    } catch (err) {
      toast.error('Không thể xóa bạn bè');
    }
  };

  useEffect(() => {
    if (tab === 'friends') fetchFriends();
    if (tab === 'requests') fetchRequests();
  }, [tab]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          👥 Bạn Bè
        </h1>
        
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setTab('friends')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              tab === 'friends' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Bạn bè ({friends.length})
          </button>
          <button 
            onClick={() => setTab('requests')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative ${
              tab === 'requests' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Lời mời
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {requests.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setTab('add')} 
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              tab === 'add' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Thêm bạn
          </button>
        </div>

        {tab === 'friends' && (
          <div className="space-y-3">
            {friends.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p className="text-4xl mb-3">😔</p>
                <p>Chưa có bạn bè nào</p>
              </div>
            ) : (
              friends.map(f => (
                <div key={f.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Avatar src={f.avatar} online={f.status === 'online'} size="md" />
                    <div>
                      <p className="font-semibold text-white">{f.username}</p>
                      <p className="text-xs text-white/60 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${f.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        {f.status === 'online' ? 'Đang online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => toast.info('Tính năng mời chơi đang phát triển')} 
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      🎮 Mời chơi
                    </Button>
                    <Button 
                      onClick={() => removeFriend(f.id, f.username)} 
                      size="sm"
                      variant="danger"
                      className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                    >
                      ❌ Xóa
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p className="text-4xl mb-3">📭</p>
                <p>Không có lời mời kết bạn nào</p>
              </div>
            ) : (
              requests.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Avatar src={r.From.avatar} size="md" />
                    <div>
                      <p className="text-white font-semibold">{r.From.username}</p>
                      <p className="text-xs text-white/60">Muốn kết bạn với bạn</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => acceptRequest(r.id)} 
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      ✓ Chấp nhận
                    </Button>
                    <Button 
                      onClick={() => declineRequest(r.id)} 
                      size="sm"
                      variant="secondary"
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      ✕ Từ chối
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'add' && (
          <div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm người chơi theo tên..."
                value={search}
                onChange={e => { setSearch(e.target.value); searchUsers(); }}
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              {results.length === 0 && search.length >= 2 && (
                <div className="text-center py-8 text-white/60">
                  <p className="text-3xl mb-2">🔍</p>
                  <p>Không tìm thấy người chơi nào</p>
                </div>
              )}
              {results.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                  <div className="flex items-center gap-4">
                    <Avatar src={u.avatar} online={u.status === 'online'} size="md" />
                    <div>
                      <p className="text-white font-semibold">{u.username}</p>
                      <p className="text-xs text-white/60 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${u.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                        {u.status === 'online' ? 'Đang online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => sendRequest(u.id)} 
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    ➕ Gửi lời mời
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}