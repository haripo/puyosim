import { SAVE_CONFIG } from '../actions/actions';
import * as storage from '../utils/StorageService';
import Config from '../models/Config';

function setValue(state, key, value) {
  storage.saveConfig(key, value);
  return state.setValue(key, value);
}

function saveConfig(state, { key, value }) {
  if (key === 'numColors') {
    // 初手固定の設定をリセットする
    state = setValue(state, 'initialColors', 'noLimit');
    state = setValue(state, 'specify1stHand', 'AA');
    state = setValue(state, 'specify2ndHand', 'notSpecified');
    state = setValue(state, 'specify3rdHand', 'notSpecified');
  }
  return setValue(state, key, value);
}

export const initialState = new Config(storage.loadConfig());

console.info('Loaded config: ', initialState.toJS());

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE_CONFIG':
      return saveConfig(state, action);
    default:
      return state;
  }
};
