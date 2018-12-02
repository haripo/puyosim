import RNLanguages from 'react-native-languages';
import i18n from 'i18n-js';
import translations from './translations';

i18n.locale = RNLanguages.language;

export const getLanguages = () => RNLanguages.languages;

i18n.fallbacks = true;
i18n.translations = translations;

export default (key: string): string => i18n.t(key);

export const t = (key: string): string => i18n.t(key);
export const formatDateTime = (date: string | Date): string => i18n.l("datetime.formats.short", date);