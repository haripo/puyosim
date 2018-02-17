import { Record } from 'immutable';
import _ from 'lodash';
import { generateHandsetPatterns } from '../service/handsetPattern';


// config の保存形式はフラットな key-value なので key が重複してはならない
export const configItems = {
  colorBalance: {
    balancedIn128: null,
    balancedIn16: null,
  },
  initialColors: {
    noLimit: null,
    avoid4ColorsIn2Hands: null,
    avoid4ColorsIn3Hands: null,
    custom2Hands: _.fromPairs(generateHandsetPatterns(2).map(p => [p, null])),
    custom3Hands: _.fromPairs(generateHandsetPatterns(3).map(p => [p, null]))
  },
  initialAllClear: {
    noLimit: null,
    avoidIn2Hands: null
  },
  numVisibleNext: {
    visibleDoubleNext: null,
    visibleNextOnly: null,
  },
  puyoSkin: {
    puyoSkinDefault: null,
    puyoSkinCharacter: null,
  }
};

export const configCategoryItem = new Set([
  `colorBalance`,
  'initialColors',
  'initialAllClear',
  'numVisibleNext',
  'puyoSkin'
]);

// default values
const recordType = {
  colorBalance: 'balancedIn128',
  initialColors: 'noLimit',
  initialAllClear: 'noLimit',
  custom2Hands: null,
  custom3Hands: null,
  numVisibleNext: 'visibleDoubleNext',
  puyoSkin: 'puyoSkinDefault'
};

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
