// src/services/ai.service.js
import { getBestMove } from "../utils/minimax.js";

export const makeAIMove = (board, aiSymbol = "O") => {
  const newBoard = JSON.parse(JSON.stringify(board)); // tránh ảnh hưởng bản gốc
  const move = getBestMove(newBoard, aiSymbol);

  if (!move) return null;

  const [row, col] = move;
  return { row, col, symbol: aiSymbol };
};
