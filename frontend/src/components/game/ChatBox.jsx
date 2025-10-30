// src/components/game/ChatBox.jsx
import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../services/socket.js';
import { useStore } from '../../store/useStore.js';
import { playNotify } from '../../services/sound.js';

export default function ChatBox({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const socket = getSocket();
  const { user } = useStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
      
      // Play notification sound if message from others
      if (msg.userId !== user.id) {
        playNotify();
        if (isMinimized) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });
    
    return () => socket.off('newMessage');
  }, [socket, user.id, isMinimized]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    socket.emit('sendMessage', { roomId, message: input });
    setInput('');
  };

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isMinimized]);

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
    if (!isMinimized === false) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-3"
        onClick={toggleMinimize}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h3 className="text-lg font-bold text-white">Chat</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce-subtle">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-white/70 hover:text-white text-xl">
          {isMinimized ? '▼' : '▲'}
        </button>
      </div>

      {/* Chat Messages */}
      {!isMinimized && (
        <>
          <div className="h-60 overflow-y-auto bg-black/20 rounded-lg p-3 mb-3 space-y-2 backdrop-blur-sm">
            {messages.length === 0 && (
              <p className="text-white/50 text-center text-sm py-8">No messages yet...</p>
            )}
            
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex ${m.userId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    m.userId === user.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-xs font-semibold opacity-70 mb-1">{m.username}</p>
                  <p className="text-sm break-words">{m.message}</p>
                  <p className="text-[10px] opacity-50 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-purple-500/50"
              maxLength={200}
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}
