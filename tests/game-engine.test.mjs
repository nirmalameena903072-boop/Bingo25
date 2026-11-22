import test from 'node:test';
import assert from 'node:assert/strict';
import { WINNING_LINES, createBoard, evaluateBoardLines, isValidBoard, resolveLineWinner } from '../game-engine.mjs';

test('board is a unique 1–25 permutation with exact 12 lines', () => {
  const board = createBoard();
  assert.equal(isValidBoard(board), true);
  assert.deepEqual([...board].sort((a, b) => a - b), Array.from({ length: 25 }, (_, i) => i + 1));
  assert.equal(WINNING_LINES.length, 12);
  assert.equal(new Set(WINNING_LINES.map(line => line.join(','))).size, 12);
});

test('returns only fully called lines and leaves the boards independent', () => {
  const a = Array.from({ length: 25 }, (_, i) => i + 1);
  const b = a.map(n => ((n + 6) % 25) + 1);
  const calls = new Set([1, 2, 3, 4, 5]);
  assert.deepEqual(evaluateBoardLines(a, calls), [WINNING_LINES[0]]);
  assert.deepEqual(evaluateBoardLines(b, calls), []);
  assert.deepEqual(evaluateBoardLines(a, [1, 2, 3, 4]), []);
});

test('only five lines win; the active caller wins an unprotected simultaneous tie', () => {
  assert.equal(resolveLineWinner(4, 0, 'player'), null);
  assert.equal(resolveLineWinner(5, 0, 'player'), 'player');
  assert.equal(resolveLineWinner(5, 5, 'bot'), 'bot');
  assert.equal(resolveLineWinner(5, 5, 'bot', true), 'player');
});
