import Immutable, { Map } from 'immutable';
import { fieldCols, fieldRows } from '../utils/constants';

function createField(row: Number, col: Number) {
  return Array(row).fill(null).map(() => Array(col).fill(0));
}

let initialState = Map({
  stack: Immutable.fromJS(createField(fieldRows, fieldCols))
});

const field = (state = initialState, action) => {
  switch (action.type) {
    case 'PUT_PAIR': {
      let { pair, location, direction } = action.payload;
      return state
        .updateIn(['stack', location.row, location.col], () => pair[0])
        .updateIn(['stack', location.row + direction.row, location.col + direction.col], () => pair[1]);
    }
    case 'PUT_SINGLE':
      let { row, col, color } = action.payload;
      return state.update('stack', (value) => value.setIn([row, col], color));
    default:
      return state;
  }
};

export default field;