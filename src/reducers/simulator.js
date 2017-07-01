/**
 * Show highlights
 * @param state
 * @param action
 */
import Immutable, { List, Map, Record } from 'immutable';
import {
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
  SHOW_HIGHLIGHTS,
  UNDO_FIELD,
  VANISH_PUYOS
} from '../actions/actions';
import PendingPair from '../models/PendingPair';
import { fieldCols, fieldRows } from '../utils/constants';
import FieldUtils from '../utils/FieldUtils';
import { calcChainStepScore } from '../utils/scoreCalculator';

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
  stack: List(),
  chain: 0,
  score: 0,
  chainScore: 0
});

function makeHistoryRecord(state) {
  return new HistoryRecord({
    queue: state.get('queue'),
    stack: state.get('stack'),
    chain: state.get('chain'),
    score: state.get('score'),
    chainScore: state.get('chainScore')
  });
}

function showHighlights(state, action) {
  let { position, rotation } = action.payload;

  if (position.col === 0 && rotation === 'left') {
    position.col = 1;
  }

  if (position.col === 5 && rotation === 'right') {
    position.col = 4;
  }

  return state
    .set('pendingPair', new PendingPair(
      position.col,
      rotation,
      state.getIn(['queue', 0, 0]),
      state.getIn(['queue', 0, 1])
    ));
}

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
  const stack = state.get('stack');
  const pair = state.get('queue').get(0);

  const positions = getDropPositions(state);

  if (positions.length === 0) {
    return state;
  }

  return state.withMutations(s => {
    for (let i = 0; i < positions.length; i++) {
      s.updateIn(['stack', positions[i].row, positions[i].col], () => positions[i].color)
    }
    return s
      .update('queue', q => q.shift().push(pair))
      .update('history', history => history.unshift(makeHistoryRecord(state)))
      .update('pendingPair', pair => pair.resetPosition())
      .set('isDropOperated', true);
  });
}

function vanishPuyos(state, action) {
  const connections = FieldUtils
    .getConnections(state.get('stack'))
    .filter(c => c.puyos.length >= 4);

  if (connections.length === 0) {
    return finishChain(state); // finish chain if nothing to vanish
  }

  if (state.get('isDropOperated')) {
    state = state
      .set('isDropOperated', false)
      .set('chain', 0)
      .set('chainScore', 0);
  }

  return state.withMutations(s => {
    const chain = s.get('chain');
    const additionalScore = calcChainStepScore(chain + 1, connections);

    connections
      .forEach(connection => {
        connection.puyos.forEach(puyo => {
          s.update('vanishingPuyos', puyos => puyos.push(Map({
            row: puyo.row,
            col: puyo.col,
            color: connection.color
          })));
          s.updateIn(['stack', puyo.row, puyo.col], () => 0);
        });
      });
    s.update('chain', chain => chain + 1);
    s.update('score', score => score + additionalScore);
    s.update('chainScore', score => score + additionalScore);
  });
}

function applyGravity(state, action) {
  if (!hasDrop(state)) {
    return finishChain(state); // finish chain if nothing to drop
  }

  return state.withMutations(s => {
    for (let i = 0; i < fieldCols; i++) {
      for (let j = 0; j < fieldRows; j++) {
        let k = fieldRows - j - 1;
        if (s.getIn(['stack', k, i]) !== 0) continue;
        while (0 <= k && s.getIn(['stack', k, i]) === 0) k--;
        if (0 <= k) {
          const target = s.getIn(['stack', k, i]);
          s.setIn(['stack', fieldRows - j - 1, i], target);
          s.setIn(['stack', k, i], 0);
          s.update('droppingPuyos', puyos => {
            return puyos.push(Map({
              row: fieldRows - j - 1,
              col: i,
              color: target,
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

function finishChain(state, action) {
  return state;
}

function undoField(state, action) {
  if (state.get('history').size === 0) {
    return state;
  }
  return state.withMutations(s => {
    const record = state.getIn(['history', 0]);
    return s
      .set('queue', record.get('queue'))
      .set('stack', record.get('stack'))
      .set('chain', record.get('chain'))
      .set('score', record.get('score'))
      .set('chainScore', record.get('chainScore'))
      .set('vanishingPuyos', List())
      .set('droppingPuyos', List())
      .update('history', history => history.shift());
  })
}

function resetField(state, action) {
  return initialState;
}

function restart(state, action) {
  initialState = createInitialState();
  return initialState;
}

function createInitialState() {
  const queue = generateQueue();
  return Map({
    queue: Immutable.fromJS(queue),
    stack: Immutable.fromJS(FieldUtils.createField(fieldRows, fieldCols)),
    chain: 0,
    chainScore: 0,
    score: 0,
    isDropOperated: false,
    pendingPair: new PendingPair(queue[0][0], queue[0][1]),
    droppingPuyos: List(),
    vanishingPuyos: List(),
    history: List()
  });
}

let initialState = createInitialState();

const simulator = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_HIGHLIGHTS:
      return showHighlights(state, action);
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
      return restart(state, action);
    default:
      return state;
  }
};

function hasDrop(state) {
  const stack = state.get('stack');
  for (let i = 0; i < fieldRows - 1; i++) {
    for (let j = 0; j < fieldCols; j++) {
      if (stack.getIn([i, j]) !== 0 && stack.getIn([i + 1, j]) === 0) {
        return true;
      }
    }
  }
  return false;
}

export function isActive(state) {
  return !(
    state.simulator.get('droppingPuyos').count() > 0 ||
    state.simulator.get('vanishingPuyos').count() > 0
  );
}

export function getGhost(state) {
  return getDropPositions(state);
}

export function getPendingPair(state) {
  const pair = state.get('pendingPair');
  const queue = state.getIn(['queue', 0]);

  let secondRow = 1;
  if (pair.rotation === 'bottom') {
    secondRow = 2;
  } else if (pair.rotation === 'top') {
    secondRow = 0;
  }

  return [
    { row: 1, col: pair.firstCol, color: queue.get(0) },
    { row: secondRow, col: pair.secondCol, color: queue.get(1) }
  ];
}

export function getVanishingPuyos(state) {
  const vanishings = state.get('vanishingPuyos');

  let field = FieldUtils.createField(fieldRows, fieldCols);
  vanishings.forEach(puyo => {
    field[puyo.get('row')][puyo.get('col')] = puyo.get('color');
  });

  const hasConnection = (row, col, color) => {
    return FieldUtils.isValidPosition({ row, col }) &&
      field[row][col] === color;
  };

  return vanishings.map(puyo => {
    const color = puyo.get('color');
    const row = puyo.get('row');
    const col = puyo.get('col');
    const connections = {
      top: hasConnection(row - 1, col, color),
      bottom: hasConnection(row + 1, col, color),
      left: hasConnection(row, col - 1, color),
      right: hasConnection(row, col + 1, color)
    };

    return puyo.set('connections', Map(connections));
  });
}

export function getStack(state) {
  const stack = state.get('stack');
  const droppings = state.get('droppingPuyos');

  const isDropping = (row, col) => {
    return !!droppings.find(p => p.get('row') === row && p.get('col') === col);
  };

  const hasConnection = (row, col, color) => {
    return FieldUtils.isValidPosition({ row, col }) &&
      0 < row &&
      stack.getIn([row, col]) === color &&
      color !== 0 &&
      !isDropping(row, col);
  };

  return stack.map((cols, row) => {
    return cols.map((color, col) => {
      let connections = {
        top: hasConnection(row - 1, col, color),
        bottom: hasConnection(row + 1, col, color),
        left: hasConnection(row, col - 1, color),
        right: hasConnection(row, col + 1, color)
      };
      if (row === 0) connections = {}; // puyos on row = 0 have no connection
      return Map({
        row: row,
        col: col,
        color: color,
        connections: Map(connections),
        isDropping: isDropping(row, col)
      });
    });
  });
}

export function getDropPositions(state) {
  const pair = state.get('pendingPair');
  const stack = state.get('stack');
  const queueHead = state.get('queue').get(0);

  const getDropRow = (col) => {
    let i = fieldRows - 1;
    while (stack.get(i) && stack.getIn([i, col]) !== 0) {
      i--;
    }
    return i;
  };

  const drop1 = { row: getDropRow(pair.firstCol), col: pair.firstCol, color: queueHead.get(0) };
  const drop2 = { row: getDropRow(pair.secondCol), col: pair.secondCol, color: queueHead.get(1) };
  if (drop1.col === drop2.col && drop1.row === drop2.row) {
    if (pair.rotation === 'bottom') {
      drop1.row -= 1;
    } else {
      drop2.row -= 1;
    }
  }

  console.log(drop1);
  console.log(drop2);
  console.log([drop1, drop2].filter(d => FieldUtils.isValidPosition(d)));

  return [drop1, drop2].filter(d => FieldUtils.isValidPosition(d));
}

export default simulator;