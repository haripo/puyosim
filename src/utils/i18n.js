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
    shareViaTwitter: 'Share '
  }
};

export default I18n;
