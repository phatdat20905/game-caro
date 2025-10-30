// src/controllers/user.controller.js
import * as UserService from '../services/user.service.js';

export const getMe = async (req, res) => {
  try {
    const user = await UserService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getProfile(id, req.user?.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await UserService.updateAvatar(req.user.id, avatar);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const users = await UserService.searchUsers(q, req.user.id);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await UserService.getUserStats(req.user.id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await UserService.getUserGames(req.user.id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};