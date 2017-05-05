import Immutable, { Map } from 'immutable';
import { fieldCols, fieldRows } from '../utils/constants';

type Stack = Immutable.List<Immutable.List<Number>>;
type Position = { row: Number, col: Number };

/**
 * Create plain javascript field object
 * @param row row size
 * @param col col size
 * @returns {Array.<Array.<Number>>} field object
 */
function createField(row: Number, col: Number) {
  return Array(row).fill(null).map(() => Array(col).fill(0));
}

/**
 * Returns puyo position considering gravity
 * @param position user input position
 * @param stack stack object
 * @param previousPuyoCol
 * @returns {{row: number, col: Number}}
 */
function getDropPosition(position: Position, stack: Stack, previousPuyoCol: Number = null): Position {
  let i = fieldRows - 1;
  while (stack.get(i).get(position.col) !== 0) {
    i--;
  }
  return {
    row: previousPuyoCol === position.col ? i - 1 : i,
    col: position.col
  };
}

/**
 * Add two position, especially position and direction
 * @param p position or direction object
 * @param q position or direction object
 * @returns {{row: number, col: number}} position
 */
function addPosition(p: Position, q: Position): Position {
  return {
    row: p.row + q.row,
    col: p.col + q.col
  }
}

/**
 * Check whether given position is valid
 * @param p position object
 * @returns {boolean} true if given position is valid
 */
function isValidPosition(p: Position): boolean {
  return (0 <= p.row && p.row < fieldRows && 0 <= p.col && p.col < fieldCols);
}

/**
 * Put pair
 */
function putNextPair(state, action) {
  const stack = state.get('stack');
  const { location, direction } = action.payload;
  const subLocation = addPosition(location, direction);
  if (isValidPosition(location) && isValidPosition(subLocation)) {
    const p1 = getDropPosition(location, stack);
    const p2 = getDropPosition(subLocation, stack, p1.col);
    let pair = [1, 2];
    if (p1.col === p2.col && 0 < direction.row) {
      pair = pair.reverse();
    }
    return state
      .updateIn(['stack', p1.row, p1.col], () => pair[0])
      .updateIn(['stack', p2.row, p2.col], () => pair[1]);
  }
  return state;
}

let initialState = Map({
  stack: Immutable.fromJS(createField(fieldRows, fieldCols))
});

const field = (state = initialState, action) => {
  switch (action.type) {
    case 'PUT_NEXT_PAIR':
      return putNextPair(state, action);
    case 'PUT_SINGLE':
      let { row, col, color } = action.payload;
      return state.update('stack', (value) => value.setIn([row, col], color));
    default:
      return state;
  }
};

export default field;