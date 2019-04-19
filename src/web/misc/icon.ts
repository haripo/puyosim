
// Import react-native-vector-icons for web

// @ts-ignore
import iconFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: MaterialIcons;
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

if (document.head) {
  document.head.appendChild(style);
} else {
  console.error('Failed to load vector icons')
}