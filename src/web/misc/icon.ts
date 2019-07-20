// Import react-native-vector-icons for web

// @ts-ignore
const document = window.document;

// @ts-ignore
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: MaterialIcons;
}`;

const style = document.createElement('style');

style.type = 'text/css';
if (style['styleSheet']) {
  style['styleSheet'].cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

if (document.head) {
  document.head.appendChild(style);
} else {
  console.error('Failed to load vector icons')
}