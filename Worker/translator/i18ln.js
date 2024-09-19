// i18n.js
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './lang/en.json';
import vi from './lang/vi.json';
const translations = {
    en,
    vi,
};

// Tạo một instance của I18n
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export default i18n;
