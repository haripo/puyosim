import * as simulator from './simulator';
import * as config from './config';

let initialState = {
  simulator: simulator.getInitialState(config.initialState),
  config: config.initialState
};

export default function(state = initialState, action) {
  simulator.reducer(state.simulator, action, state.config);
  config.reducer(state.config, action);
  return state;
};
