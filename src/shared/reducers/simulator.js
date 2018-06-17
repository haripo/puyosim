import Immutable, { List, Map, Record } from 'immutable';
import {
  APPLY_GRAVITY, DEBUG_SET_HISTORY,
  DEBUG_SET_PATTERN,
  FINISH_DROPPING_ANIMATIONS,
  FINISH_VANISHING_ANIMATIONS,
  INITIALIZE_SIMULATOR,
  MOVE_HIGHLIGHTS_LEFT,
  MOVE_HIGHLIGHTS_RIGHT, MOVE_HISTORY,
  OPEN_TWITTER_SHARE,
  PUT_NEXT_PAIR, REDO_FIELD,
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
import { loadLastState } from '../utils/StorageService';
import { calcChainStepScore } from '../utils/scoreCalculator';
import { getDropPositions } from '../selectors/simulatorSelectors';
import { createChainPlan, getDropPlan, getVanishPlan } from '../utils/ChainPlanner';
import { generateQueue } from '../utils/QueueGenerator';
import { snake, kenny } from '../utils/chainPatterns';
import {
  createHistoryRecord,
  appendHistoryRecord,
  createInitialHistoryRecord
} from '../models/History';

// TODO: ここで react-native を import しない
import { Linking } from 'react-native';
import generateIPSSimulatorURL from '../../shared/utils/generateIPSSimulatorURL';


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
  const numHands = state.get('numHands');
  const hand = state.getIn(['queue', numHands]);
  const move = state.get('pendingPair');

  const positions = getDropPositions(state);

  if (positions.length === 0) {
    return state;
  }

  return state.withMutations(s => {
    for (let i = 0; i < positions.length; i++) {
      s.updateIn(['stack', positions[i].row, positions[i].col], () => positions[i].color)
    }

    s.update('numHands', n => n + 1);
    s.update('pendingPair', pair => pair.resetPosition());
    s.set('isDropOperated', true);

    const record = createHistoryRecord(
      move.toJS(),
      hand.toJS(),
      s.get('numHands'),
      s.get('stack').toJS(),
      s.get('chain'),
      s.get('score'),
      s.get('chainScore'));
    const history = s.get('history').toJS();
    let result = appendHistoryRecord({
      version: 0,
      records: history,
      currentIndex: s.get('historyIndex')
    }, record);

    return s
      .set('history', Immutable.fromJS(result.records))
      .set('historyIndex', result.currentIndex);
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
  // simulate chain
  const stack = record.get('stack').toJS();
  createChainPlan(stack, fieldRows, fieldCols); // stack が連鎖後の状態に変更される

  return state.withMutations(s => {
    return s
      .set('numHands', record.get('numHands'))
      .set('stack', Immutable.fromJS(stack))
      .set('chain', record.get('chain'))
      .set('score', record.get('score'))
      .set('chainScore', record.get('chainScore'))
  });
}

function undoField(state, action) {
  const currentIndex = state.get('historyIndex');
  const prevIndex = state.getIn(['history', currentIndex, 'prev']);

  if (prevIndex === null) {
    // There is no history
    return state;
  }

  return state.withMutations(s => {
    const record = state.getIn(['history', prevIndex]);
    return revertFromRecord(s, record)
      .set('vanishingPuyos', List())
      .set('droppingPuyos', List())
      .set('historyIndex', prevIndex);
  })
}

function redoField(state, action) {
  const currentIndex = state.get('historyIndex');
  const nextIndexes = state.getIn(['history', currentIndex, 'next']);

  if (nextIndexes.size === 0) {
    // There is no history
    return state;
  }

  const next = state.getIn(['history', currentIndex, 'defaultNext']);

  return state.withMutations(s => {
    const record = state.getIn(['history', next]);
    return revertFromRecord(s, record)
      .set('vanishingPuyos', List())
      .set('droppingPuyos', List())
      .set('historyIndex', next);
  })
}

function moveHistory(state, action) {
  const next = action.index;

  state = state.withMutations(s => {
    const record = state.getIn(['history', next]);
    return revertFromRecord(s, record)
      .set('vanishingPuyos', List())
      .set('droppingPuyos', List())
      .set('historyIndex', next);
  });

  // update defaultNext
  return state.withMutations(s => {
    let index = state.get('historyIndex');
    while (index !== null) {
      let next = index;
      index = state.getIn(['history', index, 'prev']);
      s.setIn(['history', index, 'defaultNext'], next);
    }
  });
}

function resetField(state, action) {
  return moveHistory(state, { index: 0 });
}

function restart(state, action, config) {
  return createInitialState(config);
}

function openTwitterShare(state, action) {
  // traverse history
  let i = state.get('historyIndex');
  let record = null;
  let records = [];
  do {
    record = state.getIn(['history', i]);
    i = record.get('prev');
    records.push(record);
  } while (i > 0);

  const simulatorURL = generateIPSSimulatorURL(records.map(r => r.toJS()));
  const tweetURL = `https://twitter.com/intent/tweet?url=${simulatorURL}&text=[http://puyos.im]`;
  Linking.openURL(tweetURL);
  return state;
}

function setPattern(state, action, config) {
  let pattern = null;

  switch (action.name) {
    case 'kenny':
      pattern = kenny;
      break;
    case 'snake':
      pattern = snake;
      break;
  }

  state = createInitialState(config);
  for (let i = 0; i < fieldRows * fieldCols; i++) {
    state = state.setIn(['stack', i / 6, i % 6], pattern(i));
  }

  return state;
}

function setHistory(state, action, config) {
  switch (action.name) {
    case 'complex':
      for (let i = 0; i < 100; i++) {
        state = appendHistoryRecord(state, [i % 4 + 1, i % 3 + 1], new PendingPair(1, 1));
      }
      break;
  }

  return state;
}

function createInitialState(config) {
  const queue = generateQueue(config);
  let state = Map({
    queue: Immutable.fromJS(queue),
    numHands: 0,
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
  return state.update('history', history => {
    const stack = state.get('stack');
    return history.push(Immutable.fromJS(createInitialHistoryRecord(stack)));
  });
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
    case REDO_FIELD:
      return redoField(state, action);
    case MOVE_HISTORY:
      return moveHistory(state, action);
    case RESET_FIELD:
      return resetField(state, action);
    case RESTART:
      return restart(state, action, config);
    case OPEN_TWITTER_SHARE:
      return openTwitterShare(state, action);
    case DEBUG_SET_PATTERN:
      return setPattern(state, action, config);
    case DEBUG_SET_HISTORY:
      return setHistory(state, action, config);
    default:
      return state;
  }
};