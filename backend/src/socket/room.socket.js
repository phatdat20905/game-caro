// src/socket/room.socket.js
import db from '../models/index.js';
import { initRoom, rooms } from './game.socket.js';

const { Room, User } = db;

export default (io, socket) => {
  /**
   * Create a new room
   */
  socket.on('createRoom', async () => {
    try {
      const roomId = Date.now().toString(36).toUpperCase();
      
      // Save to database
      const dbRoom = await Room.create({
        roomId,
        player1Id: socket.user.id,
        status: 'waiting'
      });

      // Update user status
      await User.update({ status: 'in-game' }, { where: { id: socket.user.id } });

      // Join socket room
      socket.join(roomId);
      socket.currentRoom = roomId;
      
      socket.emit('roomCreated', { roomId });
      
      // Broadcast updated room list
      const availableRooms = await getAvailableRooms();
      io.emit('roomList', availableRooms);
      
      console.log(`✅ Room ${roomId} created by ${socket.user.username}`);
    } catch (error) {
      console.error('Create room error:', error);
      socket.emit('error', 'Failed to create room');
    }
  });

  /**
   * Join existing room as player
   */
  socket.on('joinRoom', async (roomId) => {
    try {
      const dbRoom = await Room.findOne({ 
        where: { roomId },
        include: [
          { model: User, as: 'Player1', attributes: ['id', 'username', 'avatar'] }
        ]
      });
      
      if (!dbRoom || dbRoom.status !== 'waiting') {
        return socket.emit('error', 'Room not available');
      }

      if (dbRoom.player1Id === socket.user.id) {
        return socket.emit('error', 'You are already in this room');
      }

      // Update database
      await dbRoom.update({ player2Id: socket.user.id, status: 'playing' });

      // Update user status
      await User.update({ status: 'in-game' }, { 
        where: { id: [dbRoom.player1Id, socket.user.id] } 
      });

      // Join socket room
      socket.join(roomId);
      socket.currentRoom = roomId;

      // Get player1 socket
      const player1Socket = io.sockets.sockets.get(
        Array.from(io.sockets.adapter.rooms.get(roomId) || [])
          .find(id => io.sockets.sockets.get(id)?.user?.id === dbRoom.player1Id)
      );

      // Initialize game room state
      if (player1Socket) {
        initRoom(roomId, player1Socket, socket, dbRoom.player1Id, socket.user.id);
      }

      // Notify all players game started
      const player2 = await User.findByPk(socket.user.id, { 
        attributes: ['id', 'username', 'avatar'] 
      });

      io.to(roomId).emit('gameStart', {
        roomId,
        board: Array(15).fill(null).map(() => Array(15).fill(null)),
        currentTurn: dbRoom.player1Id,
        player1: {
          id: dbRoom.Player1.id,
          username: dbRoom.Player1.username,
          avatar: dbRoom.Player1.avatar,
          symbol: 'X'
        },
        player2: {
          id: player2.id,
          username: player2.username,
          avatar: player2.avatar,
          symbol: 'O'
        }
      });

      // Update room list for others
      const availableRooms = await getAvailableRooms();
      io.emit('roomList', availableRooms);

      console.log(`✅ ${socket.user.username} joined room ${roomId}`);
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  /**
   * Join room as spectator
   */
  socket.on('spectateRoom', async (roomId) => {
    try {
      const room = rooms[roomId];
      if (!room) {
        return socket.emit('error', 'Game not found or not started');
      }

      socket.join(roomId);
      
      if (!room.spectators) room.spectators = [];
      room.spectators.push(socket);

      // Send current game state to spectator
      socket.emit('spectatorJoined', {
        roomId,
        board: room.board,
        moves: room.moves,
        currentTurn: room.currentTurn,
        lastMove: room.lastMove,
        player1Id: room.player1Id,
        player2Id: room.player2Id
      });

      // Notify others
      io.to(roomId).emit('spectatorCount', { count: room.spectators.length });

      console.log(`👁️ ${socket.user.username} spectating room ${roomId}`);
    } catch (error) {
      console.error('Spectate error:', error);
      socket.emit('error', 'Failed to spectate');
    }
  });

  /**
   * Leave current room
   */
  socket.on('leaveRoom', async (roomId) => {
    try {
      socket.leave(roomId);
      
      const room = rooms[roomId];
      if (room) {
        // Remove from spectators
        if (room.spectators) {
          room.spectators = room.spectators.filter(s => s.id !== socket.id);
          io.to(roomId).emit('spectatorCount', { count: room.spectators.length });
        }

        // If was a player, end the game
        const wasPlayer = room.players?.some(p => p.id === socket.id);
        if (wasPlayer) {
          const otherPlayer = room.players.find(p => p.id !== socket.id);
          
          if (otherPlayer) {
            // Other player wins by forfeit
            io.to(roomId).emit('gameOver', {
              winner: otherPlayer.user.id,
              loser: socket.user.id,
              reason: 'opponent_left'
            });

            await User.increment('score', { by: 10, where: { id: otherPlayer.user.id } });
          }

          // Clean up
          delete rooms[roomId];
          const dbRoom = await Room.findOne({ where: { roomId } });
          if (dbRoom) await dbRoom.update({ status: 'finished' });
        }
      }

      // Update user status
      await User.update({ status: 'online' }, { where: { id: socket.user.id } });
      socket.currentRoom = null;

      // Update room list
      const availableRooms = await getAvailableRooms();
      io.emit('roomList', availableRooms);

      console.log(`❌ ${socket.user.username} left room ${roomId}`);
    } catch (error) {
      console.error('Leave room error:', error);
    }
  });

  /**
   * Get list of available rooms
   */
  socket.on('getRoomList', async () => {
    const availableRooms = await getAvailableRooms();
    socket.emit('roomList', availableRooms);
  });

  /**
   * Get list of active games for spectating
   */
  socket.on('getActiveGames', async () => {
    try {
      const activeGames = [];
      
      for (const [roomId, room] of Object.entries(rooms)) {
        if (room.players && room.players.length === 2) {
          const p1 = await User.findByPk(room.player1Id, { 
            attributes: ['id', 'username', 'avatar'] 
          });
          const p2 = await User.findByPk(room.player2Id, { 
            attributes: ['id', 'username', 'avatar'] 
          });
          
          activeGames.push({
            roomId,
            player1: p1,
            player2: p2,
            spectatorsCount: room.spectators?.length || 0,
            movesCount: room.moves?.length || 0
          });
        }
      }
      
      socket.emit('activeGames', activeGames);
    } catch (error) {
      console.error('Get active games error:', error);
      socket.emit('activeGames', []);
    }
  });
};

/**
 * Helper: Get available rooms
 */
async function getAvailableRooms() {
  try {
    const dbRooms = await Room.findAll({
      where: { status: 'waiting' },
      include: [
        { model: User, as: 'Player1', attributes: ['id', 'username', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return dbRooms.map(r => ({
      roomId: r.roomId,
      player1: {
        id: r.Player1.id,
        username: r.Player1.username,
        avatar: r.Player1.avatar
      },
      createdAt: r.createdAt
    }));
  } catch (error) {
    console.error('Get available rooms error:', error);
    return [];
  }
}