import I18n from 'specific/service/i18n';
import { generateHandsetPatterns } from './handsetPattern';
import _ from 'lodash';

const translations = {
  'ja': {
    chain: '連鎖',
    points: '点',
    total: 'トータル',
    undo: '1 手戻す',
    reset: '初手に戻す',
    restart: 'リスタート',
    settings: '設定',
    about: 'puyosim について',
    confirmRestart: 'ツモが再生成されます。よろしいですか？',
    shareViaTwitter: 'Twitter で手順をシェア',

    // settings
    noLimit: '制限なし',
    queueBalanceConfig: 'ツモ補正',
    colorBalance: '配色補正',
    balancedIn128: '128 手で均等',
    balancedIn16: '16 手で均等',
    initialColors: '初手制限',
    avoid4ColorsIn2Hands: '初手 2 手で 4 色のツモを禁止',
    avoid4ColorsIn3Hands: '初手 3 手で 4 色のツモを禁止',
    initialAllClear: '全消し制限',
    avoidIn2Hands: '初手 2 手で全消しのツモを禁止',
    custom2Hands: '初手 2 手を固定',
    custom3Hands: '初手 3 手を固定',

    numVisibleNext: 'ネクスト',
    visibleDoubleNext: 'ダブルネクストを表示',
    visibleNextOnly: 'ネクストのみ表示',

    // handset patterns
    ..._.fromPairs(generateHandsetPatterns(2).map(p => [p, p])),
    ..._.fromPairs(generateHandsetPatterns(3).map(p => [p, p]))
  },
  'en': {
    chain: 'chain',
    points: 'points',
    total: 'total',
    undo: 'Undo',
    reset: 'Reset',
    restart: 'Restart',
    settings: 'Settings',
    about: 'About',
    confirmRestart: 'Color pattern will be regenerated. Are you sure?',
    shareViaTwitter: 'Share',

    noLimit: 'no limit',
    queueBalanceConfig: 'Handset generation',
    colorBalance: 'Color balance',
    balancedIn128: 'balanced in 128 hands',
    balancedIn16: 'balanced in 16 hands',
    initialColors: 'Initial handset patterns',
    avoid4ColorsIn2Hands: 'avoid 4 colors in first 2 hands',
    avoid4ColorsIn3Hands: 'avoid 4 colors in first 3 hands',
    initialAllClear: 'All clear',
    avoidIn2Hands: 'avoid in first 2 hands',
    custom2Hands: 'Custom first 2 hands',
    custom3Hands: 'Custom first 3 hands',

    numVisibleNext: 'Next window',
    visibleDoubleNext: 'Show double next',
    visibleNextOnly: 'Show next only',

    // handset patterns
    ..._.fromPairs(generateHandsetPatterns(2).map(p => [p, p])),
    ..._.fromPairs(generateHandsetPatterns(3).map(p => [p, p]))
  }
};

export default I18n(translations);
