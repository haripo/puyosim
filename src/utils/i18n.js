import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  'ja-JP': {
    nextTitle: 'ネクスト',
    garbageTitle: 'おじゃまぷよ',
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
    avoid4ColorsIn3Hands: '初手 3 手で 4 色のツモを禁止',
    initialAllClear: '全消し制限',
    avoidIn2Hands: '初手 2 手で全消しのツモを禁止',
  },
  'en': {
    nextTitle: 'Next',
    garbageTitle: 'Nuisance queue',
    chain: 'chain',
    points: 'points',
    total: 'total',
    undo: 'undo',
    reset: 'reset',
    restart: 'restart',
    settings: 'settings',
    about: 'about',
    confirmRestart: 'Color pattern will be regenerated. Are you sure?',
    shareViaTwitter: 'Share ',

    noLimit: 'no limit',
    queueBalanceConfig: 'Pairs generation',
    colorBalance: 'Color balance',
    balancedIn128: 'balanced in 128 pairs',
    balancedIn16: 'balanced in 16 pairs',
    initialColors: 'Initial colors',
    avoid4ColorsIn3Hands: 'avoid 4 colors in first 3 pairs',
    initialAllClear: 'All clear',
    avoidIn2Hands: 'avoid in first 2 pairs',
  }
};

export default I18n;
