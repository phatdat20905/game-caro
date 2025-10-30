// src/components/game/ChatBox.jsx
import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../../services/socket.js';
import { useStore } from '../../store/useStore.js';

export default function ChatBox({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socket = getSocket();
  const { user } = useStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('newMessage');
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('sendMessage', { roomId, message: input });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-2">Chat</h3>
      <div className="h-48 overflow-y-auto bg-black/20 rounded p-2 mb-2 space-y-1">
        {messages.map((m, i) => (
          <p key={i} className={`text-sm ${m.user === user.username ? 'text-right text-yellow-300' : 'text-white'}`}>
            <span className="font-semibold">{m.user}:</span> {m.message}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-3 py-2 rounded-lg text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
          Gửi
        </button>
      </form>
    </div>
  );
}