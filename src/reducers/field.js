import { Map } from 'immutable';

let initialState = Map({
  field: 0
});

const field = (state = initialState, action) => {
  switch (action.type) {
    case 'PUT_PAIR':
      return state.update('field', (value) => value + 1);
    default:
      return state;
  }
};

export default field;