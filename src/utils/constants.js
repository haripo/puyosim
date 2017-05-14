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

export const nextWindowPadding = 3;

export const puyoSize = (screen.height - contentsMargin * 2) / fieldRows;