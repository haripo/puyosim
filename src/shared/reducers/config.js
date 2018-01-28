import {
  SAVE_CONFIG
} from '../actions/actions';
import * as storage from 'specific/utils/StorageService';
import Config from '../models/Config';

function saveConfig(state, action) {
  storage.saveConfig(action.key, action.value);
  return state.setValue(action.key, action.value);
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
