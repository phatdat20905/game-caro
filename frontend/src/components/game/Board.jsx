// src/components/game/Board.jsx
import Cell from './Cell.jsx';
import { playClick } from '../../services/sound.js';

export default function Board({ board, onCellClick, currentTurn, winner, lastMove, winningCells = [] }) {
  const isLastMove = (row, col) => {
    return lastMove && lastMove.row === row && lastMove.col === col;
  };

  const isWinningCell = (row, col) => {
    return winningCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="inline-block bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 rounded-2xl shadow-2xl">
      {/* Board Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full shadow-md">
          <div className={`w-3 h-3 rounded-full ${currentTurn && !winner ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm font-semibold text-gray-700">
            {winner ? '🏆 Game Over' : currentTurn ? '⏳ Your Turn' : '⌛ Waiting...'}
          </span>
        </div>
      </div>

      {/* The Board Grid */}
      <div className="grid grid-cols-15 gap-1 bg-gradient-to-br from-amber-600 to-amber-800 p-3 rounded-xl shadow-inner">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              value={cell}
              onClick={() => {
                if (currentTurn && !winner && !cell) {
                  playClick();
                  onCellClick(r, c);
                }
              }}
              isLastMove={isLastMove(r, c)}
              isWinning={isWinningCell(r, c)}
            />
          ))
        )}
      </div>

      {/* Move Counter */}
      <div className="text-center mt-3">
        <span className="text-xs text-gray-600 font-medium">
          Moves: {board.flat().filter(cell => cell !== null).length} / 225
        </span>
      </div>
    </div>
  );
}