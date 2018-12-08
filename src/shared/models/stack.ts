import _ from 'lodash';
import { fieldCols, fieldRows } from "../utils/constants";
import { DroppingPlan, VanishingPlan } from "./ChainPlanner";
import { getFirstCol, getSecondCol, Move } from "./move";
import { PendingPairPuyo, PuyoConnection } from "../selectors/simulatorSelectors";

export type Stack = number[][];
export type Color = 0 | 1 | 2 | 3 | 4 | 5;
export type Position = { row: number, col: number };
export type Pair = number[]; // use Color[]

/**
 * Create plain javascript pairQueue object
 * @param row row size
 * @param col col size
 * @returns {Array.<Array.<Number>>} pairQueue object
 */
export function createField(row: number, col: number): Stack {
  return Array(row).fill(null).map(() => Array(col).fill(0));
}

export function cloneStack(stack: Stack): Stack {
  return _.cloneDeepWith(stack);
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

export function getDropPositions(stack: Stack, move: Move, pair: Pair): PendingPairPuyo[] {
  const firstCol = getFirstCol(move);
  const secondCol = getSecondCol(move);

  const drop1 = {
    row: getDropRowFromCol(stack, firstCol),
    col: firstCol,
    color: pair[0] as Color
  };

  const drop2 = {
    row: getDropRowFromCol(stack, secondCol),
    col: secondCol,
    color: pair[1] as Color
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

/**
 * Applies move and pair to stack
 * @param stack original stack
 * @param move move
 * @param pair pair
 * @return {Stack} modified stack
 */
export function setPair(stack: Stack, move: Move, pair: Pair): Stack {
  const positions: PendingPairPuyo[] = getDropPositions(stack, move, pair);

  if (positions.length === 0) {
    // 呼び出し側で stack が変更されたかが簡単にわかるようにするため、
    // 変更がない場合は (newStack ではなく) もとの参照を返す。
    return stack;
  }

  let newStack = cloneStack(stack);

  for (let i = 0; i < positions.length; i++) {
    newStack[positions[i].row][positions[i].col] = positions[i].color;
  }

  return newStack;
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


export type PuyoForRendering = {
  row: number,
  col: number,
  color: Color,
  connections: PuyoConnection
  isDropping: boolean
}

export type StackForRendering = PuyoForRendering[][];

export function getStackForRendering(stack: Stack, droppings): StackForRendering {
  const isDropping = (row, col) => {
    return !!droppings.find(p => p.row === row && p.col === col);
  };

  const hasConnection = (row, col, color) => {
    return isValidPosition({ row, col }) &&
      0 < row &&
      stack[row][col] === color &&
      color !== 0 &&
      !isDropping(row, col);
  };

  return stack.map((cols, row) => {
    return cols.map((color, col) => {
      let connections: any = {
        top: hasConnection(row - 1, col, color),
        bottom: hasConnection(row + 1, col, color),
        left: hasConnection(row, col - 1, color),
        right: hasConnection(row, col + 1, color)
      };
      if (row === 0) connections = {}; // puyos on row = 0 have no connection
      return {
        row: row,
        col: col,
        color: color as Color,
        connections: connections,
        isDropping: isDropping(row, col)
      };
    });
  });
}