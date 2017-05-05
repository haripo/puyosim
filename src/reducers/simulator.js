import Immutable, { Map } from 'immutable';
import { fieldCols, fieldRows } from '../utils/constants';

import FieldUtils from '../utils/FieldUtils';

const queueLength = 128;

function generateQueue() {
  let queue = [];
  for (let i = 0; i < queueLength; i++) {
    queue.push([
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4)
    ]);
  }
  return queue;
}

/**
 * Put pair
 */
function putNextPair(state, action) {
  const stack = state.get('stack');
  const pair = state.get('queue').get(0);


  const { location, direction } = action.payload;
  const positions = FieldUtils.getDropPositions(location, direction, stack);

  if (positions) {
    return state
      .update('queue', q => q.pop().push(pair))
      .updateIn(['stack', positions[0].row, positions[0].col], () => pair.get(0))
      .updateIn(['stack', positions[1].row, positions[1].col], () => pair.get(1));
  }
  return state;
}

const initialState = Map({
  queue: Immutable.fromJS(generateQueue()),
  stack: Immutable.fromJS(FieldUtils.createField(fieldRows, fieldCols))
});

const simulator = (state = initialState, action) => {
  switch (action.type) {
    case 'PUT_NEXT_PAIR':
      return putNextPair(state, action);
    default:
      return state;
  }
};

export default simulator;

