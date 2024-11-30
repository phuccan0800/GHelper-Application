import en from './languages/en';
import vi from './languages/vi';

const fallback = 'en';
let currentLanguage = 'en';
const translations = {
    en,
    vi,
};

const getLanguage = () => {
    return currentLanguage
};

export const change_language = () => {
    currentLanguage = currentLanguage === 'en' ? 'vi' : 'en';
    console.log('currentLanguage', currentLanguage);
    translate(currentLanguage);
};

export const translate = (key) => {
    const language = getLanguage();
    const translation = translations[language] || translations[fallback];
    return translation[key] || key;
};
