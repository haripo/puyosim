import { fieldCols } from '../utils/constants';

const defaultCol = 2;
const defaultRotation = 'top';

export type Rotation = 'top' | 'right' | 'bottom' | 'left';

export type Move = {
  col: number,
  rotation: Rotation,
};


function rotate(move: Move, direction: number): Move {
  const rotations: Rotation[] = ['top', 'right', 'bottom', 'left'];
  const index = rotations.findIndex(x => x === move.rotation);
  const newRotation = rotations[(index + rotations.length + direction) % rotations.length];

  move.rotation = newRotation;

  if (move.col === 0 && newRotation === 'left') {
    move.col = 1;
  }
  if (move.col === fieldCols - 1 && newRotation === 'right') {
    move.col = fieldCols - 2;
  }

  return move;
}

export function getDefaultMove(): Move {
  return { col: defaultCol, rotation: defaultRotation };
}

export function getFirstCol(move: Move): number {
  return move.col;
}

export function getSecondCol(move: Move): number {
  switch (move.rotation) {
    case 'left':
      return move.col - 1;
    case 'right':
      return move.col + 1;
    default:
      return move.col;
  }
}

export function rotateLeft(move: Move): Move {
  return rotate(move, -1);
}

export function rotateRight(move: Move): Move {
  return rotate(move, 1);
}

export function moveLeft(move: Move): Move {
  const col = move.col;
  if (col === 0 || (col === 1 && move.rotation === 'left')) {
    return move;
  }
  move.col -= 1;
  return move;
}

export function moveRight(move: Move): Move {
  const col = move.col;
  if (col === 5 || (col === 4 && move.rotation === 'right')) {
    return move;
  }
  move.col += 1;
  return move;
}

export function isEqualMove(a: Move | null, b: Move | null) {
  if (a === null || b === null) {
    return false;
  }
  return a.col === b.col && a.rotation === b.rotation;
}