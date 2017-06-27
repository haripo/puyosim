import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  'ja-JP': {
    greeting: 'こん'
  },
  'en': {
    greeting: 'Hi!'
  }
};

export default I18n;