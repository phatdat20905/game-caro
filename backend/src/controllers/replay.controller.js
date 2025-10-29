// src/controllers/replay.controller.js
import db from '../models/index.js';

const { Game } = db;

export const getReplay = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findByPk(gameId, {
      include: [
        { model: db.User, as: 'Player1', attributes: ['username'] },
        { model: db.User, as: 'Player2', attributes: ['username'] }
      ]
    });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};