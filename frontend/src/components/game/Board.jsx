import Cell from './Cell.jsx';
import { playClick, playWin } from '../../services/sound.js';

export default function Board({ board, onCellClick, currentTurn, winner }) {
  return (
    <div className="inline-block bg-amber-50 p-4 rounded-xl shadow-inner">
      <div className="grid grid-cols-15 gap-px bg-amber-800 p-2 rounded-lg">
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
              isWinning={false}
            />
          ))
        )}
      </div>
    </div>
  );
}