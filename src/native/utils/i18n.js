import I18n from 'react-native-i18n';

I18n.fallbacks = true;

export default translations => {
  I18n.translations = translations;
  return key => I18n.t(key);
}