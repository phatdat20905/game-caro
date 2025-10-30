// src/components/game/GlobalChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore.js';
import { getSocket } from '../../services/socket.js';
import Avatar from '../user/Avatar.jsx';
import { playNotify } from '../../services/sound.js';

export default function GlobalChat() {
  const { user } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    // Join global chat
    socket.emit('joinGlobalChat');

    // Listen for messages
    socket.on('globalChatMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.userId !== user.id) {
        playNotify();
      }
    });

    // Listen for user join/leave
    socket.on('userJoinedGlobal', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        text: `${data.username} đã tham gia chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('userLeftGlobal', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        text: `${data.username} đã rời khỏi chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    return () => {
      socket.off('globalChatMessage');
      socket.off('userJoinedGlobal');
      socket.off('userLeftGlobal');
      socket.emit('leaveGlobalChat');
    };
  }, [socket, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('globalChatMessage', { message: input.trim() });
    setInput('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <h3 className="text-white font-bold text-lg">Chat Toàn Cục</h3>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {messages.filter(m => m.type !== 'system').length}
          </span>
        </div>
        <button className="text-white hover:text-pink-200 transition-colors">
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <p className="text-4xl mb-2">💭</p>
                <p>Chưa có tin nhắn nào</p>
                <p className="text-sm mt-1">Hãy bắt đầu trò chuyện!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                if (msg.type === 'system') {
                  return (
                    <div key={idx} className="text-center">
                      <p className="text-xs text-white/50 italic">{msg.text}</p>
                    </div>
                  );
                }

                const isOwnMessage = msg.userId === user.id;
                
                return (
                  <div
                    key={idx}
                    className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar src={msg.avatar} size="xs" />
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {!isOwnMessage && (
                          <span className="text-xs font-semibold text-white/90">{msg.username}</span>
                        )}
                        <span className="text-xs text-white/50">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div
                        className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white/10 text-white backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                maxLength={200}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              {input.length}/200 ký tự
            </p>
          </form>
        </>
      )}
    </div>
  );
}
