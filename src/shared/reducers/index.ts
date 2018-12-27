import * as simulator from './simulator';
import * as config from './config';
import * as layout from './layout';
import * as theme from './theme';
import * as archive from './archive';
import * as auth from './auth';
import produce from 'immer';

export interface State {
  simulator: simulator.SimulatorState,
  config: any,
  layout: layout.LayoutState,
  theme: theme.ThemeState,
  archive: archive.ArchiveState,
  auth: auth.AuthState
}

let initialState: State = {
  simulator: simulator.getInitialState(config.initialState),
  config: config.initialState,
  layout: layout.initialState,
  theme: theme.initialState,
  archive: archive.initialState,
  auth: auth.initialState
};

export default function (state: State = initialState, action): State {
  return produce<State>(state, _state => {
    _state.simulator = simulator.reducer(_state.simulator, action, _state.config, _state.archive);
    _state.config = config.reducer(_state.config, action);
    _state.layout = layout.reducer(_state.layout, action);
    _state.theme = theme.reducer(_state.theme, action);
    _state.archive = archive.reducer(_state.archive, action);
    _state.auth = auth.reducer(_state.auth, action);
    return _state;
  });
};
