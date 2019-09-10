import { t } from '../platformServices/i18n';
import { handsetPatterns } from '../utils/handsetPattern';
// import { queueTree, queueList } from '../utils/puyoESportsQueue';

function generateChildren(config, patterns, allowNotSpecified) {
  const numColors = parseInt(config['numColors']);
  let children = patterns
    .filter(p => 4 < numColors || !p.includes('E'))
    .filter(p => 3 < numColors || !p.includes('D'))
    .map(p => ({ value: p, name: p }));
  if (allowNotSpecified) {
    children = [
      ...children,
      { value: 'notSpecified', name: t('notSpecified') }
    ];
  }
  return children;
}

// function generatePuyoESportsQueueConfig(tree, depth = 0) {
//   const result: any = [];
//   for (let key of Object.keys(tree)) {
//     if (typeof(tree[key]) === 'number') {
//       result.push({
//         value: key,
//         name: queueList[tree[key]].slice(0, 10)
//       });
//     } else {
//       result.push({
//         key: 'eSportsQueueId',
//         name: key,
//         type: depth == 2 ? 'radio' : 'directory',
//         children: generatePuyoESportsQueueConfig(tree[key], depth + 1)
//       });
//     }
//   }
//   return result;
// }

function generateSpecifiedFirstHandText(config) {
  const keys = [
    'specify1stHand',
    'specify2ndHand',
    'specify3rdHand'
  ];

  return keys.map(key => t(config[key])).join('-');
}

export const configItems = {
  key: 'root',
  type: 'directory',
  children: [
    {
      key: 'queueSettings',
      name: t('queueConfig'),
      type: 'radio',
      children: [
        {
          name: t('eSportsCompatible'),
          value: 'eSportsCompatible',
        },
        {
          key: 'queueGenerationCustom',
          name: t('queueGenerationCustom'),
          value: 'queueGenerationCustom',
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
                  selectedValue: generateSpecifiedFirstHandText,
                  type: 'directory',
                  children: [
                    {
                      name: t('specify1stHand'),
                      key: 'specify1stHand',
                      value: 'specify1stHand',
                      type: 'radio',
                      children: config => generateChildren(config, handsetPatterns[0], false)
                    },
                    {
                      name: t('specify2ndHand'),
                      key: 'specify2ndHand',
                      value: 'specify2ndHand',
                      type: 'radio',
                      children: config => generateChildren(config, handsetPatterns[1], true)
                    },
                    {
                      name: t('specify3rdHand'),
                      key: 'specify3rdHand',
                      value: 'specify3rdHand',
                      type: 'radio',
                      children: config => generateChildren(config, handsetPatterns[2], true)
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
            }
          ]
        },
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
    },
    {
      key: 'leftyMode',
      name: t('leftyMode'),
      type: 'radio',
      children: [
        { value: 'on', name: t('leftyOn') },
        { value: 'off', name: t('leftyOff') }
      ]
    }

  ]
};

export type ConfigValues = {
  queueSettings: string,
  numColors: string,
  colorBalance: string,
  initialColors: string,
  initialAllClear: string,

  specify1stHand: string,
  specify2ndHand: string,
  specify3rdHand: string,
  numVisibleNext: string,
  puyoSkin: string,

  leftyMode: string
}

// default values
export const defaultValues = {
  queueSettings: 'eSportsCompatible',
  numColors: '4',
  colorBalance: 'balancedIn128',
  initialColors: 'noLimit',
  initialAllClear: 'noLimit',

  specify1stHand: 'AA',
  specify2ndHand: 'notSpecified',
  specify3rdHand: 'notSpecified',
  numVisibleNext: 'visibleDoubleNext',
  puyoSkin: 'puyoSkinDefault',

  leftyMode: 'off',
};
