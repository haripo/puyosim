import { Dimensions, Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
const windowSize = Dimensions.get('window');

const androidStatusBar = 24;
const androidToolBar = 56;

const screen = {
  width: windowSize.width,
  height: isAndroid ? windowSize.height - androidStatusBar - androidToolBar : windowSize.height
};

export const fieldRows = 13;
export const fieldCols = 6;

export const contentsMargin = 3;
export const contentsPadding = 3;

export const puyoSize = (screen.height - contentsMargin * 3 - contentsPadding * 4) / (fieldRows + 3);

export const controllerButtonSize = (screen.width - puyoSize * 6 - contentsMargin * 4 - contentsPadding * 2) / 2;


export const cardBackgroundColor = '#EFEBE9';
export const themeColor = '#6D4C41';
export const themeLightColor = '#EFEBE9';

