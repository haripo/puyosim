import { ConfigValues, defaultValues } from '../models/config';

function loadConfigCompleted(state: ConfigState, action): ConfigState {
  return {
    ...state,
    ...action.config,
    isLoaded: true
  }
}

function saveConfigCompleted(state: ConfigState, action): ConfigState {
  return {
    ...state,
    ...action.config
  }
}

export type ConfigState = ConfigValues & {
  isLoaded: boolean
}

export default function getDefaultConsideredConfig(loadedConfig): ConfigValues {
  let value = defaultValues;
  for (let item in loadedConfig) {
    if (loadedConfig.hasOwnProperty(item)) {
      value[item] = loadedConfig[item];
    }
  }
  return value;
}

export const initialState: ConfigState = {
  ...getDefaultConsideredConfig({}),
  isLoaded: false
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CONFIG_COMPLETED':
      return loadConfigCompleted(state, action);
    case 'SAVE_CONFIG_COMPLETED':
      return saveConfigCompleted(state, action);
    default:
      return state;
  }
};
