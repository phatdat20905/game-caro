import * as RoomService from '../services/room.service.js';

export const create = async (req, res) => {
  try {
    const room = await RoomService.createRoom(req.user.id);
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const join = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await RoomService.joinRoom(roomId, req.user.id);
    res.json({ message: 'Joined room', room });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const list = async (req, res) => {
  try {
    const rooms = await RoomService.getAvailableRooms();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};