
function detectLanguage() {
  try {
    return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
  }
  catch(e) {
    return undefined;
  }
}

export default translations => {
  const lang = detectLanguage() || 'ja';
  console.log(lang, detectLanguage());
  return key => {
    return translations[lang][key];
  }
}
