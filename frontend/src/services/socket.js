// src/services/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  if (socket) {
    console.log('Reusing existing socket instance');
    socket.auth.token = token;
    socket.connect();
    return socket;
  }

  console.log('Creating new socket with token:', token ? 'yes' : 'no');
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    forceNew: false
  });

  socket.on('connect', () => {
    console.log('Socket CONNECTED:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket CONNECT ERROR:', err.message);
    if (err.message === 'Authentication error') {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket DISCONNECTED:', reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};