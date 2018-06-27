import * as simulator from './simulator';
import * as config from './config';
import produce from 'immer';

let initialState = {
  simulator: simulator.getInitialState(config.initialState),
  config: config.initialState
};

export default function(state = initialState, action) {
  return produce(state, _state => {
    _state.simulator = simulator.reducer(_state.simulator, action, _state.config);
    _state.config = config.reducer(_state.config, action);
    return _state;
  });
};
