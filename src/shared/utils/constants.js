import { Dimensions, Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

const windowSize = Dimensions.get('window');

const androidStatusBar = 24;
const androidToolBar = 56;

let screen = {
  width: windowSize.width,
  height: isAndroid ? windowSize.height - androidStatusBar - androidToolBar : windowSize.height
};

if (isWeb) {
  screen.height = Math.max(600, windowSize.height);
  screen.width = screen.height * 0.65;
}

export const simulatorWidth = screen.width; // for web
export const screenWidth = screen.width;
export const screenHeight = screen.height;

export const fieldRows = 13;
export const fieldCols = 6;

export const contentsMargin = 3;
export const contentsPadding = 3;

export const puyoSize = (screen.height - contentsMargin * 3 - contentsPadding * 4) / (fieldRows + 3);

export const controllerButtonWidth = (screen.width - puyoSize * 6 - contentsMargin * 4 - contentsPadding * 2) / 2;
export const controllerButtonHeight = (screen.height / 2) / 4;


export const cardBackgroundColor = '#EFEBE9';
export const buttonColor = '#8D6E63';
export const themeColor = '#6D4C41';
export const themeLightColor = '#EFEBE9';