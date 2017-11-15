import Immutable from 'immutable';
import * as simulator from './simulator';

let initialState = Immutable.fromJS({
  simulator: simulator.initialState
});

export default function(state = initialState, action) {
  return state
    .update('simulator', s => simulator.reducer(s, action));
};
