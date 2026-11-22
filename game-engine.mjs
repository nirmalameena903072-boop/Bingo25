// Pure Bingo 25 rules: a permutation of 1–25, evaluated on exactly 12 lines.
export const WINNING_LINES = Object.freeze([
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
].map(line => Object.freeze(line)));

export function isValidBoard(board) {
  return Array.isArray(board) && board.length === 25 && new Set(board).size === 25 && board.every(n => Number.isInteger(n) && n >= 1 && n <= 25);
}

export function createBoard(random = Math.random) {
  const board = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
}

/** Returns the completed winning lines, using called numbers against a board's cell values. */
export function evaluateBoardLines(board25, calledSet) {
  if (!isValidBoard(board25)) return [];
  const called = calledSet instanceof Set ? calledSet : new Set(calledSet || []);
  return WINNING_LINES.filter(line => line.every(index => called.has(board25[index])));
}

/** Five completed lines is the only win threshold; a protected defender wins a simultaneous tie. */
export function resolveLineWinner(playerLines, botLines, caller, defenderHasAegis = false) {
  const playerWins = playerLines >= 5;
  const botWins = botLines >= 5;
  if (!playerWins && !botWins) return null;
  if (playerWins && botWins) return defenderHasAegis ? (caller === "player" ? "bot" : "player") : caller;
  return playerWins ? "player" : "bot";
}
