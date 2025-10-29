// src/socket/room.socket.js
import db from '../models/index.js';

const { Room } = db;
const rooms = {}; // { roomId: { players: [socket], spectators: [], board: [...] } }

export default (io, socket) => {
  socket.on('createRoom', async () => {
    const room = await Room.create({
      roomId: Date.now().toString(36).toUpperCase(),
      player1Id: socket.user.id,
      status: 'waiting'
    });

    socket.join(room.roomId);
    rooms[room.roomId] = { players: [socket], board: Array(15).fill().map(() => Array(15).fill(null)) };
    socket.emit('roomCreated', { roomId: room.roomId });
    io.emit('roomList', Object.keys(rooms).filter(id => rooms[id].players.length < 2));
  });

  socket.on('joinRoom', async (roomId) => {
    const room = await Room.findOne({ where: { roomId } });
    if (!room || room.status !== 'waiting') return socket.emit('error', 'Room not available');

    await room.update({ player2Id: socket.user.id, status: 'playing' });
    socket.join(roomId);
    rooms[roomId].players.push(socket);

    io.to(roomId).emit('gameStart', {
      board: rooms[roomId].board,
      currentTurn: room.player1Id
    });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(s => s.id !== socket.id);
      if (rooms[roomId].players.length === 0) delete rooms[roomId];
    }
  });
};