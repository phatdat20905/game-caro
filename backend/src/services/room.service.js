import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const { Room, User } = db;

export const createRoom = async (userId) => {
  const roomId = uuidv4().slice(0, 8).toUpperCase();
  const room = await Room.create({
    roomId,
    player1Id: userId,
    status: 'waiting'
  });
  return {
    roomId: room.roomId,
    player1Id: room.player1Id,
    status: room.status
  };
};

export const joinRoom = async (roomId, userId) => {
  const room = await Room.findOne({ where: { roomId, status: 'waiting' } });
  if (!room) throw new Error('Room not found or not available');
  if (room.player1Id === userId) throw new Error('You are already in this room');

  await room.update({ player2Id: userId, status: 'playing' });
  return {
    roomId: room.roomId,
    player1Id: room.player1Id,
    player2Id: room.player2Id,
    status: room.status
  };
};

export const getAvailableRooms = async () => {
  return await Room.findAll({
    where: { status: 'waiting' },
    include: [
      { model: User, as: 'Player1', attributes: ['id', 'username', 'avatar'] }
    ],
    attributes: ['roomId', 'createdAt'],
    order: [['createdAt', 'DESC']]
  });
};