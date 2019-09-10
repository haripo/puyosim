import { handsetPatterns } from './handsetPattern';
import _ from 'lodash';

const translations = {
  'ja': {
    edit: '編集',
    delete: '削除',

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
    loadArchive: '読み込み',
    archive: '保存',

    // settings
    noLimit: '制限なし',
    numColors: '色数',
    queueConfig: 'ツモ設定',
    eSportsCompatible: 'ぷよスポ互換',
    queueGenerationCustom: 'カスタム',
    queueBalanceConfig: 'ツモ補正',
    colorBalance: '配色補正',
    balancedIn128: '128 手で均等',
    balancedIn16: '16 手で均等',
    initialColors: '初手制限',
    avoid4ColorsIn2Hands: '2 手 4 色のツモを禁止',
    avoid4ColorsIn3Hands: '3 手 4 色のツモを禁止',
    initialAllClear: '全消し制限',
    avoidIn2Hands: '2 手全消しのツモを禁止',
    specifyInitialHands: '初手を固定',
    specify1stHand: '1 手目',
    specify2ndHand: '2 手目',
    specify3rdHand: '3 手目',
    notSpecified: 'Any',
    leftyMode: '左利きモード',
    leftyOn: 'オン (2P レイアウト)',
    leftyOff: 'オフ (1P レイアウト)',

    numVisibleNext: 'ネクスト',
    visibleDoubleNext: 'ダブルネクストを表示',
    visibleNextOnly: 'ネクストのみ表示',

    puyoSkin: 'ぷよのテーマ',
    puyoSkinDefault: 'デフォルト',
    puyoSkinCharacter: '文字',

    // right drawer
    numChain: '連鎖数',
    chainScore: '連鎖スコア',
    totalScore: '累計スコア',
    numHands: '手数',
    numSplit: 'ちぎり回数',

    // share
    share: '共有',
    confirmShare: '確定',
    shareMediaType: 'メディア形式',
    shareMediaTypeNone: 'なし',
    shareMediaTypeImage: '画像',
    shareMediaTypeMovie: '動画',
    shareUrlType: 'ぷよ譜 URL',
    shareUrlTypeNone: 'なし',
    shareUrlTypeSimple: 'あり',
    shareUrlTypeWholePath: '全ての手順を共有する URL',
    shareUrlTypeCurrentPath: '現在手までの手順を共有する URL',
    shareUrlImage: 'スナップショット',
    shareUrlMovie: '連鎖動画',
    shareProcessing: '処理中',
    shareFailed: '共有に失敗しました',

    openInExistingAppAlert: 'URL を開きますか？既存の状態は破棄されます。',

    // archive
    lastModified: '更新日',
    saveArchive: '保存',
    saveModalDone: '完了',
    saveModalTitlePlaceholder: 'タイトルを入力',
    saveModalTitle: 'タイトル',
    deleteMessage: '削除しますか？',
    saveSucceeded: '保存しました',
    saveFailed: '保存に失敗しました。しばらく後にもう一度お試しください',
    loadFailed: '読み込みに失敗しました。しばらく後にもう一度お試しください',
    editFailed: '編集に失敗しました。しばらく後にもう一度お試しください',
    deleteFailed: '削除に失敗しました。しばらく後にもう一度お試しください',
    authFailed: '接続に失敗しました。しばらく後にもう一度お試しください',

    // handset patterns
    ..._.fromPairs(handsetPatterns[2].map(p => [p, p])),

    // system
    updateRequired: 'アプリの更新が必要です',

    // datetime
    datetime: {
      formats: {
        short: '%Y/%m/%d'
      }
    }
  },
  'en': {
    edit: 'Edit',
    delete: 'Delete',

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
    loadArchive: 'Load',
    archive: 'Save',

    noLimit: 'No limit',
    numColors: 'The number of colors',
    queueConfig: 'Queue',
    eSportsCompatible: 'Puyo-eSports compatible',
    queueGenerationCustom: 'Custom',
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
    notSpecified: 'Any',
    leftyMode: 'Lefty mode',
    leftyOn: 'ON (2P layout)',
    leftyOff: 'OFF (1P layout)',

    numVisibleNext: 'Next window',
    visibleDoubleNext: 'Show double next',
    visibleNextOnly: 'Show next only',

    puyoSkin: 'Puyo theme',
    puyoSkinDefault: 'Default',
    puyoSkinCharacter: 'Character',

    // right drawer
    numChain: 'chain',
    chainScore: 'chain score',
    totalScore: 'total score',
    numHands: 'hands',
    numSplit: 'splits',

    // share
    share: 'Share',
    confirmShare: 'Confirm',
    shareMediaType: 'Media',
    shareMediaTypeNone: 'None',
    shareMediaTypeImage: 'Image',
    shareMediaTypeMovie: 'Movie',
    shareUrlType: 'Simulator URL',
    shareUrlTypeNone: 'No',
    shareUrlTypeSimple: 'Yes',
    shareUrlTypeWholePath: 'URL which contains whole moves',
    shareUrlTypeCurrentPath: 'URL which contains current path of moves only',
    shareUrlImage: 'Snapshot',
    shareUrlMovie: 'Movie',
    shareProcessing: 'Processing',
    shareFailed: 'Failed to share',

    openInExistingAppAlert: 'Are you sure to open URL? Existing chain will be overwritten.',

    // archive
    saveArchive: 'Save field',
    lastModified: 'Last modified',
    saveModalDone: 'done',
    saveModalTitlePlaceholder: 'some title here',
    saveModalTitle: 'Title',
    deleteMessage: 'Delete?',
    saveSucceeded: 'Save succeeded',
    saveFailed: 'Save failed. Please try again later',
    loadFailed: 'Load failed. Please try again later',
    editFailed: 'Edit failed. Please try again later',
    deleteFailed: 'Delete failed. Please try again later',
    authFailed: 'Connection failed. Please try again later',

    // system
    updateRequired: 'App update required',

    // handset patterns
    ..._.fromPairs(handsetPatterns[2].map(p => [p, p])),

    // datetime
    datetime: {
      formats: {
        short: '%-d %b %Y'
      }
    }
  }
};

export default translations;
