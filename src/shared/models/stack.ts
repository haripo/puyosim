import { fieldCols, fieldRows } from "../utils/constants";
import { DroppingPlan, VanishingPlan } from "./ChainPlanner";
import { getFirstCol, getSecondCol, Move } from "./move";
import { getCurrentHand } from "../selectors/simulatorSelectors";

export type Stack = number[][];
export type Color = 0 | 1 | 2 | 3 | 4 | 5;
export type Position = { row: number, col: number };
export type Pair = number[];

/**
 * Create plain javascript pairQueue object
 * @param row row size
 * @param col col size
 * @returns {Array.<Array.<Number>>} pairQueue object
 */
export function createField(row: number, col: number): Stack {
  return Array(row).fill(null).map(() => Array(col).fill(0));
}

/**
 * Check whether given position is valid
 * @param p position object
 * @returns {boolean} true if given position is valid
 */
export function isValidPosition(p: Position): boolean {
  return (0 <= p.row && p.row < fieldRows && 0 <= p.col && p.col < fieldCols);
}

function getDropRowFromCol(stack: Stack, col: number): number {
  let i = fieldRows - 1;
  while (stack[i] && stack[i][col] !== 0) {
    i--;
  }
  return i;
}

export function getDropPositions(move: Move, hand: Pair, stack: Stack) {
  const firstCol = getFirstCol(move);
  const secondCol = getSecondCol(move);

  const drop1 = {
    row: getDropRowFromCol(stack, firstCol),
    col: firstCol,
    color: hand[0]
  };

  const drop2 = {
    row: getDropRowFromCol(stack, secondCol),
    col: secondCol,
    color: hand[1]
  };

  if (drop1.col === drop2.col && drop1.row === drop2.row) {
    if (move.rotation === 'bottom') {
      drop1.row -= 1;
    } else {
      drop2.row -= 1;
    }
  }

  return [drop1, drop2].filter(isValidPosition);
}

export function applyDropPlans(stack: Stack, plans: DroppingPlan[]) {
  for (let plan of plans) {
    stack[plan.row][plan.col] = plan.color;
    stack[plan.row - plan.distance][plan.col] = 0;
  }
  return stack;
}

export function applyVanishPlans(stack: Stack, plans: VanishingPlan[]): Stack {
  for (let plan of plans) {
    for (let puyo of plan.puyos) {
      stack[puyo.row][puyo.col] = 0;
    }
  }
  return stack;
}

