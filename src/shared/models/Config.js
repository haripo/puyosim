import { Record } from 'immutable';
import _ from 'lodash';

// first items in arrays are default values
export const configItems = {
  colorBalance: [
    'balancedIn128',
    'balancedIn16',
  ],
  initialColors: [
    'noLimit',
    'avoid4ColorsIn2Hands',
    'avoid4ColorsIn3Hands',
  ],
  initialAllClear: [
    'noLimit',
    'avoidIn2Hands',
  ],
}

const recordType = _.mapValues(configItems, value => value[0]);

export default class Config extends Record(recordType) {
  constructor(loadedConfig) {
    super(loadedConfig); // overwrite default values
  }

  setValue(key, value) {
    return this.set(key, value)
  }

  getValue(key, value) {
    return this.get(key);
  }
}
