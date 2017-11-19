import { Record } from 'immutable';
import _ from 'lodash';

// first items in arrays are default values
export const configItems = {
  colorBalance: {
    title: '配色補正',
    options: [
      {
        title: '128 手で均等',
        value: '128',
      },
      {
        title: '16 手で均等',
        value: '16',
      }
    ]
  },
  initialColors: {
    title: '初手配色制限',
    options: [
      {
        title: '制限なし',
        value: 'noLimit',
      },
      {
        title: '初手 3 手で 4 色のツモを禁止',
        value: 'avoid4ColorsIn3Hands',
      }
    ]
  },
  initialAllClear: {
    title: '全消し制限',
    options: [
      {
        title: '制限なし',
        value: 'noLimit',
      },
      {
        title: '初手 2 手で全消しのツモを禁止',
        value: 'avoidIn2Hands',
      }
    ]
  },
}

const recordType = _.mapValues(configItems, value => value.options[0].value);

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
