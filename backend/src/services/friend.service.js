// src/services/friend.service.js
import db from '../models/index.js';

const { Friend, FriendRequest, User } = db;

export const sendRequest = async (fromId, toUsername) => {
  const toUser = await User.findOne({ where: { username: toUsername } });
  if (!toUser) throw new Error('User not found');
  if (toUser.id === fromId) throw new Error('Cannot send to yourself');

  const existing = await FriendRequest.findOne({
    where: { fromId, toId: toUser.id }
  });
  if (existing) throw new Error('Request already sent');

  return await FriendRequest.create({ fromId, toId: toUser.id });
};

export const acceptRequest = async (requestId, userId) => {
  const request = await FriendRequest.findOne({
    where: { id: requestId, toId: userId, status: 'pending' }
  });
  if (!request) throw new Error('Request not found');

  await request.update({ status: 'accepted' });
  await Friend.create({ userId: request.toId, friendId: request.fromId });
  await Friend.create({ userId: request.fromId, friendId: request.toId });

  return request;
};

export const getFriends = async (userId) => {
  return await Friend.findAll({
    where: { userId },
    include: [{ model: User, as: 'FriendUser', attributes: ['id', 'username', 'avatar', 'status'] }]
  });
};

export const getRequests = async (userId) => {
  return await FriendRequest.findAll({
    where: { toId: userId, status: 'pending' },
    include: [{ model: User, as: 'From', attributes: ['id', 'username', 'avatar'] }]
  });
};