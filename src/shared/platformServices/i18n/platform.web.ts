import translations from '../../utils/translations';

function detectLanguage() {
  try {
    // @ts-ignore
    // browserLanguage, userLanguage が ts にはない
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage)
      .substr(0, 2);
  }
  catch (e) {
    return 'en';
  }
}

const lang = detectLanguage();

export const t = (key: string): string => (translations[lang] || translations['en'])[key];
export const formatDateTime = (date: string | Date) => 'not implemented';