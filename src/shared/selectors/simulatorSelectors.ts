import { getFirstCol, getSecondCol } from '../models/move';
import { getDropPositions as getDropPositionsStack, getStackForRendering, } from '../models/stack';
import { SimulatorState } from '../reducers/simulator';
import { createSelector } from 'reselect';
import { deserializeHistoryRecords, serializeHistoryRecords } from "../models/serializer";
import { getCurrentPathRecords, HistoryRecord } from "../models/history";
import { DroppingPlan } from "../models/chainPlanner";
import _ from 'lodash';
import { captureException } from "../platformServices/sentry";
import { ArchiveRequestPayload, Color, PendingPair, PendingPairPuyo, StackForRendering } from "../../types";
import { getCurrentHand } from "../models/queue";
import { calcHistoryTreeLayout } from '../models/treeLayout';

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

export const getCurrentHandSelector = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands
  ],
  getCurrentHand
);

export const getNextHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands + 1
  ],
  getCurrentHand
);

export const getDoubleNextHand = createSelector(
  [
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.numHands + 2
  ],
  getCurrentHand
);


const _getPendingPair = state => state.pendingPair;

export const getPendingPair = createSelector(
  [_getPendingPair, getCurrentHandSelector],
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
    (state: SimulatorState) => getCurrentHandSelector(state)
  ],
  getDropPositionsStack
);

export const getHistoryTreeLayout = createSelector(
  [
    (state: SimulatorState) => state.history,
    (state: SimulatorState) => state.queue,
    (state: SimulatorState) => state.historyIndex
  ],
  calcHistoryTreeLayout
);

export type HistoryGraphNode = {
  row: number,
  col: number,
  record: HistoryRecord,
  isCurrentNode: boolean,
  historyIndex: number,
  // path: HistoryGraphPath | null
}

export type HistoryGraphPath = {
  from: { row: number, col: number },
  to: { row: number, col: number },
  isCurrentPath: boolean
}

export type HistoryGraph = {
  nodes: HistoryGraphNode,
  paths: HistoryGraphPath,
  queue: number[][],
  width: number,
  height: number
}

// TODO: model に移動する

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