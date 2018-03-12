import Immutable, { List, Map, Record } from 'immutable';
import {
  INITIALIZE_SIMULATOR,
  APPLY_GRAVITY,
  FINISH_DROPPING_ANIMATIONS,
  FINISH_VANISHING_ANIMATIONS,
  MOVE_HIGHLIGHTS_LEFT,
  MOVE_HIGHLIGHTS_RIGHT,
  PUT_NEXT_PAIR,
  RESET_FIELD,
  RESTART,
  ROTATE_HIGHLIGHTS_LEFT,
  ROTATE_HIGHLIGHTS_RIGHT,
  UNDO_FIELD,
  VANISH_PUYOS
} from '../actions/actions';
import PendingPair from '../models/PendingPair';
import { fieldCols, fieldRows } from '../utils/constants';
import FieldUtils from '../utils/FieldUtils';
import { loadLastState, saveLastState } from '../../shared/utils/StorageService';
import { calcChainStepScore } from '../utils/scoreCalculator';
import { getDropPositions } from '../selectors/simulatorSelectors';
import { getDropPlan, getVanishPlan } from '../models/ChainPlanner';
import { generateQueue } from '../models/QueueGenerator';


const HistoryRecord = Record({
  queue: List(),
  stack: List(), // TODO: queue are redundant
  chain: 0,
  score: 0,
  chainScore: 0,

  move: null,
  pair: List(),

  prev: List(),
  next: List()
});

// history helpers

/**
 * Creates history record
 * @param state
 * @param pair
 * @param prev
 * @param next
 * @returns {Immutable.Map<string, any>}
 */
function makeHistoryRecord(state, pair, prev, next) {
  return new HistoryRecord({
    queue: state.get('queue'),
    stack: state.get('stack'),
    chain: state.get('chain'),
    score: state.get('score'),
    chainScore: state.get('chainScore'),
    move: state.get('pendingPair'),
    pair: pair,
    prev: List(prev),
    next: List(next)
  });
}

/**
 * Appends history record to history tree
 * @param state
 * @param pair
 */
function appendHistoryRecord(state, pair) {
  const prevIndex = state.get('historyIndex');
  const nextIndex = state.get('history').size;

  const record = makeHistoryRecord(state, pair, [prevIndex], []);

  return state
    .updateIn(['history', prevIndex, 'next'], indexes => {
      if (!indexes) {
        return indexes;
      }
      return indexes.push(nextIndex);
    })
    .update('history', h => h.push(record))
    .set('historyIndex', nextIndex);
}


// reducer functions

function rotateHighlightsLeft(state, action) {
  return state.update('pendingPair', pair => pair.rotateLeft());
}

function rotateHighlightsRight(state, action) {
  return state.update('pendingPair', pair => pair.rotateRight());
}

function moveHighlightsLeft(state, action) {
  return state.update('pendingPair', pair => pair.moveLeft());
}

function moveHighlightsRight(state, action) {
  return state.update('pendingPair', pair => pair.moveRight());
}

/**
 * Put pair
 */
function putNextPair(state, action) {
  const pair = state.get('queue').get(0);

  const positions = getDropPositions(state);

  if (positions.length === 0) {
    return state;
  }

  return state.withMutations(s => {
    for (let i = 0; i < positions.length; i++) {
      s.updateIn(['stack', positions[i].row, positions[i].col], () => positions[i].color)
    }

    s.update('queue', q => q.shift().push(pair))
    s.update('pendingPair', pair => pair.resetPosition())
    s.set('isDropOperated', true);
    return appendHistoryRecord(s, pair)
  });
}

function vanishPuyos(state, action) {
  const stack = state.get('stack').toJS();
  const plans = getVanishPlan(stack, fieldRows, fieldCols);

  if (plans.length === 0) {
    // save current state
    // TODO: Redux として正しいか？
    //saveLastState(makeHistoryRecord(state));
    return state;
  }

  if (state.get('isDropOperated')) { // TODO: わかりにくいのでなおす
    state = state
      .set('isDropOperated', false)
      .set('chain', 0)
      .set('chainScore', 0);
  }


  return state.withMutations(s => {
    // update vanishingPuyos and stack
    for (let plan of plans) {
      for (let puyo of plan.puyos) {
        s.update('vanishingPuyos', p => p.push(Immutable.fromJS({ ...puyo, color: plan.color })));
        s.setIn(['stack', puyo.row, puyo.col], 0);
      }
    }

    // update scores
    const additionalScore = calcChainStepScore(s.get('chain') + 1, plans);
    s.update('chain', chain => chain + 1);
    s.update('score', score => score + additionalScore);
    s.update('chainScore', score => score + additionalScore);
  });
}

function applyGravity(state) {
  // toJS が重いかも？
  // stack をより軽い形 (stringとか) で保持した方がいいかもしれない
  const stack = state.get('stack').toJS();
  const plans = getDropPlan(stack, fieldRows, fieldCols);

  return state.withMutations(s => {
    //s.set('stack', Immutable.fromJS(stack));
    for (let plan of plans) {
      s.setIn(['stack', plan.row, plan.col], plan.color);
      s.setIn(['stack', plan.row - plan.distance, plan.col], 0);
    }
    s.set('droppingPuyos', Immutable.fromJS(plans));
  });
}

function finishDroppingAnimations(state) {
  return state.set('droppingPuyos', List());
}

function finishVanishingAnimations(state) {
  return state.set('vanishingPuyos', List());
}

function revertFromRecord(state, record) {
  return state.withMutations(s => {
    return s
      .set('queue', record.get('queue'))
      .set('stack', record.get('stack'))
      .set('chain', record.get('chain'))
      .set('score', record.get('score'))
      .set('chainScore', record.get('chainScore'))
  });
}

function undoField(state, action) {
  const currentIndex = state.get('historyIndex');
  const prevIndexes = state.getIn(['history', currentIndex, 'prev']);

  if (prevIndexes.size === 0) {
    // There is no history
    return state;
  }

  const prev = prevIndexes.get(0);

  return state.withMutations(s => {
    const record = state.getIn(['history', prev]);
    return revertFromRecord(s, record)
      .set('vanishingPuyos', List())
      .set('droppingPuyos', List())
      .set('historyIndex', prev);
  })
}

function resetField(state, action) {
  while (!state.getIn(['history', 'prev'])) {
    state = undoField(state, null)
  }
  return state;
}

function restart(state, action, config) {
  return createInitialState(config);
}

function createInitialState(config) {
  const queue = generateQueue(config);
  let state = Map({
    queue: Immutable.fromJS(queue),
    stack: Immutable.fromJS(FieldUtils.createField(fieldRows, fieldCols)),
    chain: 0,
    chainScore: 0,
    score: 0,
    isDropOperated: false,
    pendingPair: new PendingPair(queue[0][0], queue[0][1]),
    droppingPuyos: List(),
    vanishingPuyos: List(),
    history: List(),
    historyIndex: 0
  });
  return state.update('history', history => history.push(makeHistoryRecord(state, null, [], [])));
}

function loadOrCreateInitialState(config) {
  let record = loadLastState();
  if (record) {
    // revert last state
    let state = createInitialState(config);
    return revertFromRecord(state, Immutable.fromJS(record))
  } else {
    return createInitialState(config);
  }
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
    case RESET_FIELD:
      return resetField(state, action);
    case RESTART:
      return restart(state, action, config);
    default:
      return state;
  }
};