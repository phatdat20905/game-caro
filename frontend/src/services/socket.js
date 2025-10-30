// src/services/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => socket?.disconnect();