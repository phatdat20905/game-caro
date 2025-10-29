import * as GameService from '../services/game.service.js';

export const leaderboard = async (req, res) => {
  try {
    const top = await GameService.getLeaderboard();
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const history = async (req, res) => {
  try {
    const games = await GameService.getHistory(req.user.id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};