
// Import react-native-vector-icons for web

// @ts-ignore
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: Material Icons;
}`;

const style = document.createElement('style');

style.type = 'text/css';
// TODO: fix
// @ts-ignore
if (style.styleSheet) {
  // @ts-ignore
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

document.head.appendChild(style);