// src/controllers/friend.controller.js
import * as FriendService from '../services/friend.service.js';

export const send = async (req, res) => {
  try {
    const { username } = req.body;
    const request = await FriendService.sendRequest(req.user.id, username);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const accept = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendService.acceptRequest(requestId, req.user.id);
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const decline = async (req, res) => {
  try {
    const { requestId } = req.params;
    await FriendService.declineRequest(requestId, req.user.id);
    res.json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { friendId } = req.params;
    await FriendService.removeFriend(req.user.id, parseInt(friendId));
    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const list = async (req, res) => {
  try {
    const friends = await FriendService.getFriends(req.user.id);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const requests = async (req, res) => {
  try {
    const list = await FriendService.getRequests(req.user.id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};