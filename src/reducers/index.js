import Immutable from 'immutable';
import * as simulator from './simulator';
import * as config from './config';

let initialState = Immutable.fromJS({
  simulator: simulator.initialState,
  config: config.initialState
});

export default function(state = initialState, action) {
  return state
    .update('simulator', s => simulator.reducer(s, action))
    .update('config', s => config.reducer(s, action));
};
