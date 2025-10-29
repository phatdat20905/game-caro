// src/controllers/admin.controller.js
import * as AdminService from '../services/admin.service.js';

export const ban = async (req, res) => {
  try {
    const { userId, reason, days } = req.body;
    const user = await AdminService.banUser(req.user.id, userId, reason, days);
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const online = async (req, res) => {
  try {
    const users = await AdminService.getOnlineUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};