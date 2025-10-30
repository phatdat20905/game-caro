// src/store/useStore.js
import { create } from 'zustand';
import { connectSocket, disconnectSocket } from '../services/socket.js';

export const useStore = create((set, get) => ({
  user: null,
  token: null,
  socket: null,

  login: (userData, accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    const socket = connectSocket(accessToken);
    set({ user: userData, token: accessToken, socket });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    disconnectSocket();
    set({ user: null, token: null, socket: null });
  },

  updateUser: (updates) => {
    set((state) => ({ user: { ...state.user, ...updates } }));
  },
}));