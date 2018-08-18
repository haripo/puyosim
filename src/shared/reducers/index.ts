import * as simulator from './simulator';
import * as config from './config';
import * as layout from './layout';
import * as theme from './theme';
import produce from 'immer';

let initialState = {
  simulator: simulator.getInitialState(config.initialState),
  config: config.initialState,
  layout: layout.initialState,
  theme: theme.initialState
};

export default function (state = initialState, action) {
  return produce(state, _state => {
    _state.simulator = simulator.reducer(_state.simulator, action, _state.config);
    _state.config = config.reducer(_state.config, action);
    _state.layout = layout.reducer(_state.layout, action);
    _state.theme = theme.reducer(_state.theme, action);
    return _state;
  });
};
