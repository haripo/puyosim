import {
  APPLY_GRAVITY,
  DEBUG_SET_HISTORY,
  DEBUG_SET_PATTERN,
  FINISH_DROPPING_ANIMATIONS,
  FINISH_VANISHING_ANIMATIONS,
  INITIALIZE_SIMULATOR, LOAD_ARCHIVE, LOAD_ARCHIVE_FINISHED,
  MOVE_HIGHLIGHTS_LEFT,
  MOVE_HIGHLIGHTS_RIGHT,
  MOVE_HISTORY,
  OPEN_TWITTER_SHARE,
  PUT_NEXT_PAIR,
  RECONSTRUCT_HISTORY,
  REDO_FIELD,
  RESET_FIELD,
  RESTART,
  ROTATE_HIGHLIGHTS_LEFT,
  ROTATE_HIGHLIGHTS_RIGHT,
  UNDO_FIELD,
  VANISH_PUYOS
} from '../actions/actions';
import { getDefaultMove, Move, moveLeft, moveRight, rotateLeft, rotateRight } from '../models/move';
import { fieldCols, fieldRows } from '../utils/constants';
import { calcChainStepScore } from '../models/score';
import { getCurrentHand, getDefaultNextMove } from '../selectors/simulatorSelectors';
import { createChainPlan, DroppingPlan, getDropPlan, getVanishPlan, VanishingPlan } from '../models/chainPlanner';
import { generateQueue } from '../models/queue';
import { setPatternByName, setRandomHistory } from '../models/debug';
import {
  appendHistoryRecord,
  createHistoryFromMinimumHistory,
  createHistoryRecord,
  createInitialHistoryRecord,
  History,
  HistoryRecord
} from '../models/history';
// TODO: ここで react-native を import しない
import { Linking } from 'react-native';
import generateIPSSimulatorURL from '../../shared/utils/generateIPSSimulatorURL';
import { applyDropPlans, applyVanishPlans, createField, setPair, Stack } from '../models/stack';
import { deserializeHistoryRecords, deserializeQueue } from "../models/serializer";
import uuid from 'uuid/v4';
import { ArchivedPlay } from "../utils/StorageService.native";
import _ from 'lodash';

export type SimulatorState = {
  queue: number[][],
  numHands: number,
  stack: Stack,
  chain: number,
  chainScore: number,
  score: number,
  isResetChainRequired: boolean,
  pendingPair: Move,
  droppingPuyos: DroppingPlan[],
  vanishingPuyos: VanishingPlan[],
  history: HistoryRecord[],
  historyIndex: number,

  playId: string,
  startDateTime: Date // Date を直接編集すると immer が immutability を保証しないので注意
};

function rotateHighlightsLeft(state: SimulatorState, action) {
  state.pendingPair = rotateLeft(state.pendingPair);
  return state;
}

function rotateHighlightsRight(state: SimulatorState, action) {
  state.pendingPair = rotateRight(state.pendingPair);
  return state;
}

function moveHighlightsLeft(state: SimulatorState, action) {
  state.pendingPair = moveLeft(state.pendingPair);
  return state;
}

function moveHighlightsRight(state: SimulatorState, action) {
  state.pendingPair = moveRight(state.pendingPair);
  return state;
}

function putNextPair(state: SimulatorState, action) {
  const hand = getCurrentHand(state);
  const move = state.pendingPair;
  const prevStack = state.stack;

  state.stack = setPair(prevStack, move, hand);

  if (state.stack === prevStack) {
    // 設置不可だった場合（= Stack が変化しなかった場合）、設置処理を行わない
    return state;
  }

  state.numHands += 1;
  state.isResetChainRequired = true;
  state.pendingPair = getDefaultNextMove(state);

  const record = createHistoryRecord(
    move,
    hand,
    state.numHands,
    state.stack,
    state.chain,
    state.score,
    state.chainScore);

  let result = appendHistoryRecord({
    version: 0,
    records: state.history,
    currentIndex: state.historyIndex
  }, record);

  state.history = result.records;
  state.historyIndex = result.currentIndex;

  return state;
}

function vanishPuyos(state: SimulatorState, action) {
  const plans = getVanishPlan(state.stack, fieldRows, fieldCols);

  if (plans.length === 0) {
    return state;
  }

  if (state.isResetChainRequired) {
    state.isResetChainRequired = false;
    state.chain = 0;
    state.chainScore = 0;
  }

  state.stack = applyVanishPlans(state.stack, plans);
  state.vanishingPuyos = plans;

  state.chain += 1;

  // update scores
  const additionalScore = calcChainStepScore(state.chain, plans);
  state.score += additionalScore;
  state.chainScore += additionalScore;

  return state;
}

function applyGravity(state: SimulatorState, action) {
  const plans = getDropPlan(state.stack, fieldRows, fieldCols);

  state.stack = applyDropPlans(state.stack, plans);
  state.droppingPuyos = plans;

  return state;
}

function finishDroppingAnimations(state: SimulatorState, action) {
  state.droppingPuyos = [];
  return state;
}

function finishVanishingAnimations(state: SimulatorState, action) {
  state.vanishingPuyos = [];
  return state;
}

function revertFromRecord(state: SimulatorState, record: HistoryRecord) {
  // simulate chain
  createChainPlan(state.stack, fieldRows, fieldCols); // stack が連鎖後の状態に変更される

  state.numHands = record.numHands;
  state.stack = record.stack;
  state.chainScore = record.chainScore;
  state.chain = record.chain;
  state.score = record.score;

  return state
}

function revert(state: SimulatorState, historyIndex: number) {
  const record = state.history[historyIndex];
  state = revertFromRecord(state, record);
  state.vanishingPuyos = [];
  state.droppingPuyos = [];
  state.historyIndex = historyIndex;
  state.pendingPair = getDefaultNextMove(state);
  state.isResetChainRequired = true;

  return state;
}

function undoField(state: SimulatorState, action) {
  const currentIndex = state.historyIndex;
  const prevIndex = state.history[currentIndex].prev;

  if (prevIndex === null) {
    // There is no history
    return state;
  }

  return revert(state, prevIndex);
}

function redoField(state: SimulatorState, action) {
  const currentIndex = state.historyIndex;
  const next = state.history[currentIndex].defaultNext;
  if (next == null) {
    return state;
  }
  return revert(state, next);
}

function moveHistory(state: SimulatorState, action): SimulatorState {
  const next = action.index;

  state = revert(state, next);

  // update defaultNext path
  let index: number | null = state.historyIndex;
  while (index !== null) {
    let next = index;
    index = state.history[index].prev;
    if (index === null) break;
    state.history[index].defaultNext = next;
  }

  return state;
}

function resetField(state: SimulatorState, action) {
  return moveHistory(state, { index: 0 });
}

function restart(state: SimulatorState, action, config) {
  return createInitialState(config);
}

function openTwitterShare(state: SimulatorState, action) {
  // traverse history
  let i: number = state.historyIndex;
  let record: HistoryRecord;
  let records: HistoryRecord[] = [];
  do {
    record = state.history[i];
    i = record.prev!;
    records.push(record!);
  } while (i > 0);

  const simulatorURL = generateIPSSimulatorURL(records);
  const tweetURL = `https://twitter.com/intent/tweet?url=${simulatorURL}&text=[http://puyos.im]`;
  Linking.openURL(tweetURL);
  return state;
}

function setPattern(state: SimulatorState, action) {
  state.stack = setPatternByName(state.stack, action.name);
  return state;
}

function setHistory(state: SimulatorState, action) {
  const history: History = {
    records: state.history,
    currentIndex: state.historyIndex,
    version: 0
  };
  const result = setRandomHistory(history, state.stack);
  state.history = result.records;
  state.historyIndex = result.currentIndex;
  return state;
}

function reconstructHistory(state: SimulatorState, action): SimulatorState {
  const { history, queue, index } = action;
  state.queue = deserializeQueue(queue);
  state.history = createHistoryFromMinimumHistory(deserializeHistoryRecords(history), state.queue);
  state.historyIndex = index;

  state.startDateTime = new Date();
  state.playId = uuid();

  state = revert(state, index);
  return state;
}

function loadArchiveFinished(state: SimulatorState, action) {
  const play: ArchivedPlay = action.play;
  state.playId = play.id;
  state.queue = _.chunk(play.queue, 2);
  state.history = createHistoryFromMinimumHistory(deserializeHistoryRecords(play.history), state.queue);
  state.historyIndex = play.historyIndex;
  state.startDateTime = play.createdAt;

  state = revert(state, state.historyIndex);
  return state;
}

function createInitialState(config): SimulatorState {
  const queue = generateQueue(config);
  const stack = createField(fieldRows, fieldCols);
  return {
    queue: queue,
    numHands: 0,
    stack: stack,
    chain: 0,
    chainScore: 0,
    score: 0,
    isResetChainRequired: false,
    pendingPair: getDefaultMove(),
    droppingPuyos: [],
    vanishingPuyos: [],
    history: [createInitialHistoryRecord(stack)],
    historyIndex: 0,
    startDateTime: new Date(),
    playId: uuid()
  };
}


function loadOrCreateInitialState(config) {
  // TODO : load last state
  return createInitialState(config);
}

export function getInitialState(config) {
  return loadOrCreateInitialState(config);
}

export const reducer = (state, action, config) => {
  switch (action.type) {
    case INITIALIZE_SIMULATOR:
      return state; // not implemented
    case ROTATE_HIGHLIGHTS_LEFT:
      return rotateHighlightsLeft(state, action);
    case ROTATE_HIGHLIGHTS_RIGHT:
      return rotateHighlightsRight(state, action);
    case MOVE_HIGHLIGHTS_LEFT:
      return moveHighlightsLeft(state, action);
    case MOVE_HIGHLIGHTS_RIGHT:
      return moveHighlightsRight(state, action);
    case PUT_NEXT_PAIR:
      return putNextPair(state, action);
    case VANISH_PUYOS:
      return vanishPuyos(state, action);
    case APPLY_GRAVITY:
      return applyGravity(state, action);
    case FINISH_DROPPING_ANIMATIONS:
      return finishDroppingAnimations(state, action);
    case FINISH_VANISHING_ANIMATIONS:
      return finishVanishingAnimations(state, action);
    case UNDO_FIELD:
      return undoField(state, action);
    case REDO_FIELD:
      return redoField(state, action);
    case MOVE_HISTORY:
      return moveHistory(state, action);
    case RESET_FIELD:
      return resetField(state, action);
    case RESTART:
      return restart(state, action, config);
    case RECONSTRUCT_HISTORY:
      return reconstructHistory(state, action);
    case LOAD_ARCHIVE_FINISHED:
      return loadArchiveFinished(state, action);
    case OPEN_TWITTER_SHARE:
      return openTwitterShare(state, action);
    case DEBUG_SET_PATTERN:
      return setPattern(state, action);
    case DEBUG_SET_HISTORY:
      return setHistory(state, action);
    default:
      return state;
  }
};