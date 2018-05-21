import { Record } from 'immutable';
import t from '../../shared/service/i18n';
import { handsetPatterns } from '../service/handsetPattern';

function generateChildren(patterns) {
  return [
    { value: 'notSpecified', name: t('notSpecified') },
    ...patterns.map(p => ({ value: p, name: p }))
  ];
}

export const configItems = {
  key: 'root',
  type: 'directory',
  children: [
    {
      key: 'numColors',
      name: t('numColors'),
      type: 'radio',
      children: [
        {
          value: '3',
          name: '3'
        },
        {
          value: '4',
          name: '4'
        },
        {
          value: '5',
          name: '5'
        }
      ]
    },
    {
      key: 'colorBalance',
      name: t('colorBalance'),
      type: 'radio',
      children: [
        {
          value: 'balancedIn128',
          name: t('balancedIn128')
        },
        {
          value: 'balancedIn16',
          name: t('balancedIn16')
        }
      ]
    },
    {
      key: 'initialColors',
      name: t('initialColors'),
      type: 'radio',
      children: [
        {
          value: 'noLimit',
          name: t('noLimit')
        },
        {
          value: 'avoid4ColorsIn2Hands',
          name: t('avoid4ColorsIn2Hands')
        },
        {
          value: 'avoid4ColorsIn3Hands',
          name: t('avoid4ColorsIn3Hands')
        },
        {
          key: 'specifyInitialHands',
          value: 'specifyInitialHands',
          name: t('specifyInitialHands'),
          selectedValue: c => `${t(c['specify1stHand'])}-${t(c['specify2ndHand'])}-${t(c['specify3rdHand'])}`,
          type: 'directory',
          children: [
            {
              name: t('specify1stHand'),
              key: 'specify1stHand',
              value: 'specify1stHand',
              type: 'radio',
              children: generateChildren(handsetPatterns[0])
            },
            {
              name: t('specify2ndHand'),
              key: 'specify2ndHand',
              value: 'specify2ndHand',
              type: 'radio',
              children: generateChildren(handsetPatterns[1])
            },
            {
              name: t('specify3rdHand'),
              key: 'specify3rdHand',
              value: 'specify3rdHand',
              type: 'radio',
              children: generateChildren(handsetPatterns[2])
            }
          ]
        }
      ]
    },
    {
      key: 'initialAllClear',
      name: t('initialAllClear'),
      type: 'radio',
      children: [
        { value: 'noLimit', name: t('noLimit') },
        { value: 'avoidIn2Hands', name: t('avoidIn2Hands') }
      ]
    },
    {
      key: 'numVisibleNext',
      name: t('numVisibleNext'),
      type: 'radio',
      children: [
        { value: 'visibleDoubleNext', name: t('visibleDoubleNext') },
        { value: 'visibleNextOnly', name: t('visibleNextOnly') }
      ]
    },
    {
      key: 'puyoSkin',
      name: t('puyoSkin'),
      type: 'radio',
      children: [
        { value: 'puyoSkinDefault', name: t('puyoSkinDefault') },
        { value: 'puyoSkinCharacter', name: t('puyoSkinCharacter') }
      ]
    }
  ]
};

// default values
const recordType = {
  numColors: '4',
  colorBalance: 'balancedIn128',
  initialColors: 'noLimit',
  initialAllClear: 'noLimit',

  specifyInitialHands: null,
  specify1stHand: null,
  specify2ndHand: null,
  specify3rdHand: null,
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
