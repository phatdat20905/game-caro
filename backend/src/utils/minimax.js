// src/utils/minimax.js

// ✅ Kiểm tra thắng
const checkWin = (board, row, col, symbol) => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    // Kiểm tra xuôi
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === symbol) count++;
      else break;
    }

    // Kiểm tra ngược
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === symbol) count++;
      else break;
    }

    if (count >= 5) return true;
  }

  return false;
};

// ✅ Hàm đánh giá heuristic (đơn giản)
const evaluate = (board, player) => {
  const opponent = player === "O" ? "X" : "O";

  const scoreSymbol = (symbol) => {
    let score = 0;

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        if (board[r][c] !== symbol) continue;

        // Kiểm tra 4 hướng
        for (const [dr, dc] of [
          [0, 1],
          [1, 0],
          [1, 1],
          [1, -1],
        ]) {
          let count = 0;

          for (let i = 0; i < 5; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15 && board[nr][nc] === symbol)
              count++;
            else break;
          }

          // Cộng điểm tùy độ dài chuỗi
          if (count === 5) score += 100000;
          else if (count === 4) score += 1000;
          else if (count === 3) score += 100;
          else if (count === 2) score += 10;
        }
      }
    }

    return score;
  };

  return scoreSymbol(player) - scoreSymbol(opponent);
};

// ✅ Hàm minimax (có cắt tỉa alpha-beta)
export const minimax = (board, depth, alpha, beta, maximizing, player) => {
  if (depth === 0) return evaluate(board, player);

  const emptyCells = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (board[r][c] === null) emptyCells.push([r, c]);
    }
  }

  if (emptyCells.length === 0) return 0;

  const opponent = player === "O" ? "X" : "O";

  if (maximizing) {
    let maxScore = -Infinity;
    for (const [r, c] of emptyCells) {
      board[r][c] = player;
      if (checkWin(board, r, c, player)) {
        board[r][c] = null;
        return 1000000;
      }

      const score = minimax(board, depth - 1, alpha, beta, false, player);
      board[r][c] = null;

      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const [r, c] of emptyCells) {
      board[r][c] = opponent;
      if (checkWin(board, r, c, opponent)) {
        board[r][c] = null;
        return -1000000;
      }

      const score = minimax(board, depth - 1, alpha, beta, true, player);
      board[r][c] = null;

      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
};

// ✅ Chọn nước đi tốt nhất
export const getBestMove = (board, player) => {
  let bestScore = -Infinity;
  let bestMove = null;

  // Giảm độ sâu khi bàn cờ đầy hơn để tăng tốc độ
  const depth = board.flat().filter((x) => x !== null).length < 10 ? 3 : 2;

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (board[r][c] !== null) continue;

      board[r][c] = player;
      if (checkWin(board, r, c, player)) {
        board[r][c] = null;
        return [r, c];
      }

      const score = minimax(board, depth, -Infinity, Infinity, false, player);
      board[r][c] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }
  }

  return bestMove;
};
