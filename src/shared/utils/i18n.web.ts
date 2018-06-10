import translations from './translations';

function detectLanguage() {
  try {
    // @ts-ignore
    // browserLanguage, userLanguage が ts にはない
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage)
      .substr(0, 2);
  }
  catch (e) {
    return undefined;
  }
}

const lang = detectLanguage() || 'ja';

export default (key: string): string => translations[lang][key];
