/**
 * Show highlight on the field
 * @param state
 * @param action
 * @returns new state
 */
import Immutable, { List, Map, Record } from 'immutable';
import { fieldCols, fieldRows } from '../utils/constants';

import FieldUtils from '../utils/FieldUtils';

const queueLength = 128;

function generateQueue() {
  let queue = [];
  for (let i = 0; i < queueLength; i++) {
    queue.push([
      Math.floor(Math.random() * 4) + 1,
      Math.floor(Math.random() * 4) + 1
    ]);
  }
  return queue;
}

const HistoryRecord = Record({
  queue: List(),
  stack: List()
});

function makeHistoryRecord(state) {
  return new HistoryRecord({
    queue: state.get('queue'),
    stack: state.get('stack')
  });
}

/**
 * Show highlights
 * @param state
 * @param action
 */
function showHighlights(state, action) {
  const { position, direction } = action.payload;
  const highlightPositions = FieldUtils.getHighlightPositions(position, direction);
  let ghostPositions = FieldUtils.getDropPositions(position, direction, state.get('stack'));
  if (ghostPositions) {
    ghostPositions[0].color = state.getIn(['queue', 0, 0]);
    ghostPositions[1].color = state.getIn(['queue', 0, 1]);
    return state
      .set('highlights', Immutable.fromJS(highlightPositions))
      .set('ghosts', Immutable.fromJS(ghostPositions));
  }
  return state;
}

/**
 * Hide highlights
 * @param state
 * @param action
 * @returns new state
 */
function hideHighlights(state, action) {
  return state
    .set('highlights', List())
    .set('ghosts', List());
}

/**
 * Put pair
 */
function putNextPair(state, action) {
  const stack = state.get('stack');
  const pair = state.get('queue').get(0);

  const { position, direction } = action.payload;
  const positions = FieldUtils.getDropPositions(position, direction, stack);

  if (positions) {
    return state
      .update('queue', q => q.shift().push(pair))
      .updateIn(['stack', positions[0].row, positions[0].col], () => pair.get(0))
      .updateIn(['stack', positions[1].row, positions[1].col], () => pair.get(1))
      .update('history', history => history.unshift(makeHistoryRecord(state)));
  }
  return state;
}

function vanishPuyos(state, action) {
  return state.withMutations(s => {
    action.payload.targets.forEach(target => {
      s.update('vanishingPuyos', puyos => {
        return puyos.push(Map({
          row: target[0],
          col: target[1],
          color: state.getIn(['stack', target[0], target[1]])
        }))
      });
      s.updateIn(['stack', target[0], target[1]], () => 0);
    });
  });
}

function applyGravity(state, action) {
  return state.withMutations(s => {
    for (let i = 0; i < fieldCols; i++) {
      for (let j = 0; j < fieldRows; j++) {
        let k = fieldRows - j - 1;
        if (s.getIn(['stack', k, i]) !== 0) continue;
        while (0 <= k && s.getIn(['stack', k, i]) === 0) k--;
        if (0 <= k) {
          s.setIn(['stack', fieldRows - j - 1, i], s.getIn(['stack', k, i]));
          s.setIn(['stack', k, i], 0);
          s.update('droppingPuyos', puyos => {
            return puyos.push(Map({
              row: fieldRows - j - 1,
              col: i,
              altitude: (fieldRows - j - 1) - k
            }));
          });
        }
      }
    }
  });
}

function finishDroppingAnimations(state, action) {
  return state.set('droppingPuyos', List());
}

function finishVanishingAnimations(state, action) {
  return state.set('vanishingPuyos', List());
}

function undoField(state, action) {
  return state
    .set('queue', state.getIn(['history', 0, 'queue']))
    .set('stack', state.getIn(['history', 0, 'stack']))
    .update('history', history => history.shift())
}

const initialState = Map({
  queue: Immutable.fromJS(generateQueue()),
  stack: Immutable.fromJS(FieldUtils.createField(fieldRows, fieldCols)),
  chain: Map({
    count: 0,
    isActive: false
  }),
  highlights: List(),
  ghosts: List(),
  droppingPuyos: List(),
  vanishingPuyos: List(),
  history: List()
});

const simulator = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_HIGHLIGHTS':
      return showHighlights(state, action);
    case 'HIDE_HIGHLIGHTS':
      return hideHighlights(state, action);
    case 'PUT_NEXT_PAIR':
      return putNextPair(state, action);
    case 'VANISH_PUYOS':
      return vanishPuyos(state, action);
    case 'APPLY_GRAVITY':
      return applyGravity(state, action);
    case 'FINISH_DROPPING_ANIMATIONS':
      return finishDroppingAnimations(state, action);
    case 'FINISH_VANISHING_ANIMATIONS':
      return finishVanishingAnimations(state, action);
    case 'UNDO_FIELD':
      return undoField(state, action);
    default:
      return state;
  }
};

/**
 * Selector function to get connected puyos
 * @returns {Array}
 */
export function getConnectedPuyos(state) {
  const stack = state.simulator.get('stack');

  let result = [];
  for (let i = 0; i < fieldRows; i++) {
    for (let j = 0; j < fieldCols; j++) {
      if (stack.getIn([i, j]) !== 0) {
        const count = FieldUtils.getConnectedCount(i, j, stack);
        if (count >= 4) {
          result.push([i, j]);
        }
      }
    }
  }
  return result;
}

export function getDroppingPuyos(state) {
  return state.simulator.get('droppingPuyos');
}

export default simulator;