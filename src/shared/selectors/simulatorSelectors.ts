import { fieldCols, fieldRows } from '../utils/constants';
import _ from 'lodash';
import { getFirstCol, getSecondCol } from '../models/move';
import { createField, isValidPosition } from '../models/stack';
import { SimulatorState } from '../reducers/simulator';

export function wrapCache(f, ...args): any {
  let argsCache = {};
  let resultCache = null;

  return state => {
    const isNotUpdated = _.every(args, arg => state[arg] === argsCache[arg]);

    if (isNotUpdated && resultCache !== null) {
      // use cache
      return resultCache;
    }

    for (let arg of args) {
      argsCache[arg] = state[arg];
    }

    resultCache = f(..._.values(_.pick(argsCache, args)), state);
    return resultCache;
  }
}

export function isActive(state): boolean {
  return !(
    state.simulator.droppingPuyos.length > 0 ||
    state.simulator.vanishingPuyos.length > 0
  );
}

export function canUndo(state: SimulatorState): boolean {
  return state.history[state.historyIndex].prev !== null;
}

export function canRedo(state: SimulatorState): boolean {
  return state.history[state.historyIndex].next.length > 0;
}

export function getGhost(state: SimulatorState) {
  return getDropPositions(state);
}

export function getPendingPair(state: SimulatorState) {
  const pair = state.pendingPair; // as Move
  const hand = getCurrentHand(state);

  let secondRow = 1;
  if (pair.rotation === 'bottom') {
    secondRow = 2;
  } else if (pair.rotation === 'top') {
    secondRow = 0;
  }

  return [
    { row: 1, col: getFirstCol(pair), color: hand[0] },
    { row: secondRow, col: getSecondCol(pair), color: hand[1] }
  ];
}

export const getVanishingPuyos = wrapCache(_getVanishingPuyos, 'vanishingPuyos');

function _getVanishingPuyos(vanishings) {
  let field = createField(fieldRows, fieldCols);

  for (let plan of vanishings) {
    for (let puyo of plan.puyos) {
      field[puyo.row][puyo.col] = plan.color;
    }
  }

  const hasConnection = (row, col, color) => {
    return isValidPosition({ row, col }) && field[row][col] === color;
  };

  let result: any[] = [];

  for (let plan of vanishings) {
    for (let puyo of plan.puyos) {
      const row = puyo.row;
      const col = puyo.col;
      const color = plan.color;
      result.push({
        row: row,
        col: col,
        color: plan.color,
        connections: {
          top: hasConnection(row - 1, col, color),
          bottom: hasConnection(row + 1, col, color),
          left: hasConnection(row, col - 1, color),
          right: hasConnection(row, col + 1, color)
        }
      });
    }
  }

  return result;
}


export const getStack = wrapCache(_getStack, 'stack', 'droppingPuyos');

function _getStack(stack, droppings) {
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
        color: color,
        connections: connections,
        isDropping: isDropping(row, col)
      };
    });
  });
}

export const getCurrentHand = wrapCache(
  (queue, numHands) => queue[numHands % queue.length],
  'queue', 'numHands');

export const getNextHand = wrapCache(
  (queue, numHands) => queue[(numHands + 1) % queue.length],
  'queue', 'numHands');

export const getDoubleNextHand = wrapCache(
  (queue, numHands) => queue[(numHands + 2) % queue.length],
  'queue', 'numHands');

export const getDropPositions = wrapCache(_getDropPositions, 'pendingPair', 'stack', 'queue', 'numHands');

function _getDropPositions(pair, stack, queue, numHands, state): any[] {
  // TODO: use model/stack.ts 's getDropPositions
  const hand: any = getCurrentHand(state);
  const firstCol = getFirstCol(pair);
  const secondCol = getSecondCol(pair);

  const getDropRow = (col) => {
    let i = fieldRows - 1;
    while (stack[i] && stack[i][col] !== 0) {
      i--;
    }
    return i;
  };

  const drop1 = { row: getDropRow(firstCol), col: firstCol, color: hand[0] };
  const drop2 = { row: getDropRow(secondCol), col: secondCol, color: hand[1] };
  if (drop1.col === drop2.col && drop1.row === drop2.row) {
    if (pair.rotation === 'bottom') {
      drop1.row -= 1;
    } else {
      drop2.row -= 1;
    }
  }

  return [drop1, drop2].filter(d => isValidPosition(d));
}

export const getHistoryTreeLayout = wrapCache(_getHistoryTreeLayout, 'history', 'historyIndex');

function _getHistoryTreeLayout(history, historyIndexBase) {
  let nodes: any[] = [];
  let paths: any[] = [];
  let rightmostRow = 0;
  let deepestColumn = 0;

  // calc indexMap
  let indexMap = {};
  {
    let index = historyIndexBase;
    while (index) {
      const p = history[index];
      indexMap[p.prev] = index;
      index = p.prev;
    }
  }

  // calc graph layout
  const calcLayout = (historyIndex, depth, parentRow) => {
    const record = history[historyIndex];
    if (!record) {
      return;
    }

    return record.next.map((nextIndex, index) => {
      if (index > 0) {
        rightmostRow += 1;
      }
      const isCurrentPath = indexMap[historyIndex] === nextIndex;

      if (historyIndex > 0) {
        paths.push({
          from: { row: parentRow, col: depth - 1 },
          to: { row: rightmostRow, col: depth },
          isCurrentPath
        });
      }
      if (depth > deepestColumn) {
        deepestColumn = depth;
      }
      nodes.push({
        row: rightmostRow,
        col: depth,
        move: history[nextIndex].move,
        isCurrentNode: nextIndex === historyIndexBase,
        historyIndex: nextIndex
      });
      calcLayout(nextIndex, depth + 1, rightmostRow);
    });
  };
  calcLayout(0, 0, 0);

  // extract hands from history
  let hands: any[] = [];

  const searchHands = (index, depth) => {
    const record = history[index];
    if (depth > 0) {
      hands[depth - 1] = record.pair;
    }
    record.next.map(nextIndex => {
      searchHands(nextIndex, depth + 1);
    });
  };
  searchHands(0, 0);

  return {
    nodes,
    paths,
    hands,
    width: rightmostRow,
    height: deepestColumn
  };
}