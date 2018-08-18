import I18n from 'react-native-i18n';
import translations from './translations';

I18n.fallbacks = true;
I18n.translations = translations;

export default (key: string): string => I18n.t(key);