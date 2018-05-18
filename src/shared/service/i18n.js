import I18n from 'specific/service/i18n';
import { handsetPatterns } from './handsetPattern';
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
    history: '履歴モード',
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
    specifyInitialHands: '初手を固定',
    specify1stHand: '1 手目',
    specify2ndHand: '2 手目',
    specify3rdHand: '3 手目',
    notSpecified: 'フリー',

    numVisibleNext: 'ネクスト',
    visibleDoubleNext: 'ダブルネクストを表示',
    visibleNextOnly: 'ネクストのみ表示',

    puyoSkin: 'ぷよの種類',
    puyoSkinDefault: 'デフォルト',
    puyoSkinCharacter: '文字',

    // handset patterns
    ..._.fromPairs(handsetPatterns[2].map(p => [p, p]))
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
    history: 'History mode',
    confirmRestart: 'Color pattern will be regenerated. Are you sure?',
    shareViaTwitter: 'Share',

    noLimit: 'No limit',
    queueBalanceConfig: 'Handset generation',
    colorBalance: 'Color balance',
    balancedIn128: 'Balanced in 128 hands',
    balancedIn16: 'Balanced in 16 hands',
    initialColors: 'Initial handset patterns',
    avoid4ColorsIn2Hands: 'Avoid 4 colors in first 2 hands',
    avoid4ColorsIn3Hands: 'Avoid 4 colors in first 3 hands',
    initialAllClear: 'All clear',
    avoidIn2Hands: 'Avoid in first 2 hands',
    specifyInitialHands: 'Fix initial hands',
    specify1stHand: '1st',
    specify2ndHand: '2nd',
    specify3rdHand: '3rd',
    notSpecified: 'free',

    numVisibleNext: 'Next window',
    visibleDoubleNext: 'Show double next',
    visibleNextOnly: 'Show next only',

    puyoSkin: 'Puyo Skin',
    puyoSkinDefault: 'Default',
    puyoSkinCharacter: 'Character',

    // handset patterns
    ..._.fromPairs(handsetPatterns[2].map(p => [p, p]))
  }
};

export default I18n(translations);
