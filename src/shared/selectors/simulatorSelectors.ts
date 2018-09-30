import { fieldCols, fieldRows } from '../utils/constants';
import { getFirstCol, getSecondCol } from '../models/move';
import {
  Color, createField, isValidPosition,
  getDropPositions as getDropPositionsStack
} from '../models/stack';
import { SimulatorState } from '../reducers/simulator';
import { createSelector } from 'reselect';
import { serializeHistoryRecords, serializeQueue } from "../models/serializer";
import { getCurrentPathRecords, HistoryRecord } from "../models/history";
import { DroppingPlan } from "../models/chainPlanner";

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

export function getGhost(state: SimulatorState): PendingPairPuyo[] {
  return getDropPositions(state);
}

export function getGhostForSnapshot(state: SimulatorState): PendingPairPuyo[] {
  if (state.historyIndex === 0) {
    return [];
  }

  return getDropPositionsStack(
    state.history[state.historyIndex - 1].stack,
    state.history[state.historyIndex].move!,
    getPreviousHand(state)
  )
}

export const getPreviousHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands
  ],
  (queue, numHands) => queue[(numHands - 1) % queue.length]
);

export const getCurrentHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands
  ],
  (queue, numHands) => queue[numHands % queue.length]
);

export const getNextHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands
  ],
  (queue, numHands) => queue[(numHands + 1) % queue.length]
);

export const getDoubleNextHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands
  ],
  (queue, numHands) => queue[(numHands + 2) % queue.length]
);

export type PendingPairPuyo = {
  row: number,
  col: number,
  color: Color
}
export type PendingPair = PendingPairPuyo[];

const _getPendingPair = state => state.pendingPair;

export const getPendingPair = createSelector(
  [_getPendingPair, getCurrentHand],
  (pair, hand): PendingPair => {
    let secondRow = 1;
    if (pair.rotation === 'bottom') {
      secondRow = 2;
    } else if (pair.rotation === 'top') {
      secondRow = 0;
    }

    return [
      { row: 1, col: getFirstCol(pair), color: hand[0] as Color },
      { row: secondRow, col: getSecondCol(pair), color: hand[1] as Color }
    ];
  }
);

export const getVanishingPuyos = createSelector(
  [(state: SimulatorState) => state.vanishingPuyos],
  _getVanishingPuyos
);

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

export type PuyoConnection = {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean
}

export type PuyoForRendering = {
  row: number,
  col: number,
  color: Color,
  connections: PuyoConnection
  isDropping: boolean
}

export type StackForRendering = PuyoForRendering[][];


export const getStack = createSelector(
  [
    (state: SimulatorState) => state.stack,
    (state: SimulatorState) => state.droppingPuyos
  ],
  _getStack
);

function _getStack(stack, droppings): StackForRendering {
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

export const getStackForSnapshot = createSelector(
  [
    (state: SimulatorState) => state.history,
    (state: SimulatorState) => state.historyIndex,
    (state: SimulatorState) => state.droppingPuyos
  ],
  (history: HistoryRecord[], historyIndex: number, droppings: DroppingPlan[]): StackForRendering => {
    if (historyIndex === 0) {
      return _getStack(history[0].stack, droppings);
    } else {
      return _getStack(history[historyIndex - 1].stack, droppings);
    }
  }
);

export const getDropPositions = createSelector(
  [
    (state: SimulatorState) => state.stack,
    (state: SimulatorState) => state.pendingPair,
    (state: SimulatorState) => getCurrentHand(state)
  ],
  getDropPositionsStack
);

export const getHistoryTreeLayout = createSelector(
  [
    (state: SimulatorState) => state.history,
    (state: SimulatorState) => state.historyIndex
  ],
  _getHistoryTreeLayout
);

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

export type ShareUrls = {
  whole: string,
  current: string
}

export function getShareURL(state: SimulatorState): ShareUrls {
  const q = serializeQueue(state.queue);
  const i = state.historyIndex.toString();
  const whole = serializeHistoryRecords(state.history);
  const current = serializeHistoryRecords(
    getCurrentPathRecords(state.history, state.historyIndex));

  if (state.history.length <= 1) {
    return {
      whole: 'http://puyos.im/v?q=${q}',
      current: 'http://puyos.im/v?q=${q}',
    }
  }

  return {
    whole: `http://puyos.im/v?q=${q}&h=${whole}&i=${i}`,
    current: `http://puyos.im/v?q=${q}&h=${current}&i=${current.length - 1}`,
  }
}
