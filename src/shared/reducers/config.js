import { SAVE_CONFIG } from '../actions/actions';
import { saveConfig, loadConfig } from '../utils/StorageService';
import getInitialState from '../models/config';

function save(state, { key, value }) {
  if (key === 'numColors') {
    // 初手固定の設定をリセットする
    state.initialColors = 'noLimit';
    state.specify1stHand = 'AA';
    state.specify2ndHand = 'notSpecified';
    state.specify3rdHand = 'notSpecified';
  }
  saveConfig(key, value);
  state[key] = value;
  return state;
}

export const initialState = getInitialState(loadConfig());

console.info('Loaded config: ', initialState);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_CONFIG':
      return save(state, action);
    default:
      return state;
  }
};
