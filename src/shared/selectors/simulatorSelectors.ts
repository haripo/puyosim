import { getDefaultMove, getFirstCol, getSecondCol } from '../models/move';
import { getDropPositions as getDropPositionsStack, getStackForRendering, } from '../models/stack';
import { SimulatorState } from '../reducers/simulator';
import { createSelector } from 'reselect';
import { deserializeHistoryRecords, serializeHistoryRecords } from "../models/serializer";
import { getCurrentPathRecords, HistoryRecord } from "../models/history";
import { DroppingPlan } from "../models/chainPlanner";
import _ from 'lodash';
// @ts-ignore
import { ArchiveRequestPayload } from "../utils/OnlineStorageService";
// @ts-ignore
import { captureException } from "../utils/Sentry";
import { Color, Move, PendingPair, PendingPairPuyo, StackForRendering } from "../../types";

export function canUndo(state: SimulatorState): boolean {
  return state.history[state.historyIndex].prev !== null;
}

export function canRedo(state: SimulatorState): boolean {
  return state.history[state.historyIndex].next.length > 0;
}

export function getDefaultNextRecord(state: SimulatorState): HistoryRecord | null {
  const next = state.history[state.historyIndex].defaultNext;
  if (!next) {
    return null;
  }
  return state.history[next];
}

export function getDefaultNextMove(state: SimulatorState): Move {
  const nextRecord = getDefaultNextRecord(state);
  if (nextRecord && nextRecord.type === 'move') {
    return nextRecord.move;
  } else {
    return getDefaultMove();
  }
}

export function getGhost(state: SimulatorState): PendingPairPuyo[] {
  return getDropPositions(state);
}

export function getGhostForSnapshot(state: SimulatorState): PendingPairPuyo[] {
  const record = state.history[state.historyIndex];
  if (record.type !== 'move') {
    return [];
  }

  return getDropPositionsStack(
    state.history[state.historyIndex - 1].stack,
    record.move,
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

export const getStackForSnapshot = createSelector(
  [
    (state: SimulatorState) => state.history,
    (state: SimulatorState) => state.historyIndex,
    (state: SimulatorState) => state.droppingPuyos
  ],
  (history: HistoryRecord[], historyIndex: number, droppings: DroppingPlan[]): StackForRendering => {
    return _getStack(history[historyIndex].stack, droppings);
  }
);

function _getStack(stack, droppings): StackForRendering {
  return getStackForRendering(stack, droppings);
}

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

export function getArchivePayload(state: SimulatorState): ArchiveRequestPayload {
  // serialize に失敗するパターンがあるようなので、デバッグのため確認する。
  let serialized = 'not set';
  let deserialized: any = null;
  try {
    serialized = serializeHistoryRecords(state.history);
    deserialized = deserializeHistoryRecords(serialized);
    if (_.isEqual(state.history, deserialized)) {
      throw new Error('Not succeeded');
    }
  } catch (e) {
    console.error(state);
    console.error(e);
    console.error(serialized);
    console.error(deserialized);
    captureException(e);
  }

  return {
    title: state.title,
    play: {
      id: state.playId,
      history: serializeHistoryRecords(state.history),
      historyIndex: state.historyIndex,
      maxChain: _.max(state.history.map(h => h.chain)) || 0,
      queue: _.flatten(state.queue),
      stack: _.flatten(state.stack),
      score: state.score,
      updatedAt: new Date(),
      createdAt: state.startDateTime
    }
  }
}

export const hasEditRecord = createSelector(
  [
    (state: SimulatorState) => state.history,
    (state: SimulatorState) => state.historyIndex,
  ],
  (history, index) => {
    return getCurrentPathRecords(history, index)
      .map(record => record.type === 'edit')
      .reduce((a, b) => a || b);
  }
);