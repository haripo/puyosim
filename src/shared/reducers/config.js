import { SAVE_CONFIG } from '../actions/actions';
import * as storage from '../utils/StorageService';
import getInitialState from '../models/config';

function setValue(state, key, value) {
  storage.saveConfig(key, value);
  state[key] = value;
  return state;
}

function saveConfig(state, { key, value }) {
  if (key === 'numColors') {
    // 初手固定の設定をリセットする
    state.initialColors = 'noLimit';
    state.specify1stHand = 'AA';
    state.specify2ndHand = 'notSpecified';
    state.specify3rdHand = 'notSpecified';
  }
  return setValue(state, key, value);
}

export const initialState = getInitialState(storage.loadConfig());

console.info('Loaded config: ', initialState);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_CONFIG':
      return saveConfig(state, action);
    default:
      return state;
  }
};
