import {
  ARCHIVE_CURRENT_FIELD_FINISHED,
  DEBUG_SET_HISTORY,
  DEBUG_SET_PATTERN,
  EDIT_ARCHIVE_FINISHED,
  INITIALIZE_SIMULATOR,
  LOAD_ARCHIVE,
  MOVE_HIGHLIGHTS_LEFT,
  MOVE_HIGHLIGHTS_RIGHT,
  MOVE_HISTORY,
  PUT_NEXT_PAIR,
  RECONSTRUCT_HISTORY,
  REDO_FIELD,
  REFRESH_PLAY_ID,
  RESET_FIELD,
  RESTART,
  ROTATE_HIGHLIGHTS_LEFT,
  ROTATE_HIGHLIGHTS_RIGHT,
  UNDO_FIELD
} from '../actions/actions';
import { getDefaultMove, Move, moveLeft, moveRight, rotateLeft, rotateRight } from '../models/move';
import { fieldCols, fieldRows } from '../utils/constants';
import { getCurrentHand, getDefaultNextMove } from '../selectors/simulatorSelectors';
import { createChainPlan } from '../models/chainPlanner';
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
import { createField, getSplitHeight, setPair } from '../models/stack';
import { deserializeHistoryRecords, deserializeQueue } from "../models/serializer";
import uuid from 'uuid/v4';
import _ from 'lodash';
// @ts-ignore
import { Archive } from "../utils/OnlineStorageService";
import { createFieldReducer, FieldState, initialFieldState } from "./field";

export type SimulatorState = FieldState & {
  queue: number[][],
  numHands: number,
  numSplit: number,
  pendingPair: Move,
  history: HistoryRecord[],
  historyIndex: number,

  startDateTime: Date, // Date を直接編集すると immer が immutability を保証しないので注意

  playId: string,
  title: string,
  isSaved: boolean
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
  const splitHeight = getSplitHeight(prevStack, move);

  state.stack = setPair(prevStack, move, hand);

  if (state.stack === prevStack) {
    // 設置不可だった場合（= Stack が変化しなかった場合）、設置処理を行わない
    return state;
  }

  state.numHands += 1;
  state.isResetChainRequired = true;
  state.pendingPair = getDefaultNextMove(state);
  state.numSplit += splitHeight ? 1 : 0;

  const record = createHistoryRecord(
    move,
    hand,
    state.numHands,
    state.stack,
    state.chain,
    state.score,
    state.chainScore,
    state.numSplit);

  let result = appendHistoryRecord({
    version: 0,
    records: state.history,
    currentIndex: state.historyIndex
  }, record);

  state.history = result.records;
  state.historyIndex = result.currentIndex;

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
  state.numSplit = record.numSplit;

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

function loadArchive(state: SimulatorState, action, archives) {
  const archive: Archive = archives.archives[action.id];
  state.playId = archive.play.id;
  state.queue = _.chunk(archive.play.queue, 2);
  state.history = createHistoryFromMinimumHistory(deserializeHistoryRecords(archive.play.history), state.queue);
  state.historyIndex = archive.play.historyIndex;
  state.startDateTime = archive.play.createdAt;
  state.isSaved = true;
  state.title = archive.title;

  state = revert(state, state.historyIndex);
  return state;
}

function archiveCurrentFieldFinished(state: SimulatorState, action) {
  const { archive } = action;
  state.isSaved = true;
  state.title = archive.title;
  return state;
}

function editArchiveFinished(state: SimulatorState, action) {
  const { archive } = action;
  if (archive.play.id === state.playId) {
    state.title = archive.title;
  }
  return state;
}

function refreshPlayId(state: SimulatorState, action) {
  state.playId = uuid();
  return state;
}

function createInitialState(config): SimulatorState {
  const queue = generateQueue(config);
  const stack = createField(fieldRows, fieldCols);
  return {
    ...initialFieldState,
    queue: queue,
    numHands: 0,
    numSplit: 0,
    pendingPair: getDefaultMove(),
    history: [createInitialHistoryRecord(stack)],
    historyIndex: 0,
    startDateTime: new Date(),
    playId: uuid(),
    isSaved: false,
    title: ''
  };
}


function loadOrCreateInitialState(config) {
  // TODO : load last state
  return createInitialState(config);
}

export function getInitialState(config) {
  return loadOrCreateInitialState(config);
}

const fieldReducer = createFieldReducer('simulator');

export const reducer = (state, action, config, archive) => {
  state = {
    ...state,
    ...fieldReducer(state, action)
  };

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
    case LOAD_ARCHIVE:
      return loadArchive(state, action, archive);
    case ARCHIVE_CURRENT_FIELD_FINISHED:
      return archiveCurrentFieldFinished(state, action);
    case EDIT_ARCHIVE_FINISHED:
      return editArchiveFinished(state, action);
    case REFRESH_PLAY_ID:
      return refreshPlayId(state, action);
    case DEBUG_SET_PATTERN:
      return setPattern(state, action);
    case DEBUG_SET_HISTORY:
      return setHistory(state, action);
    default:
      return state;
  }
};