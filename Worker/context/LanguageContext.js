// context/LanguageContext.js
import React, { createContext, useState } from 'react';
import i18n from '../translator/i18ln';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [locale, setLocale] = useState(i18n.locale);

    const changeLanguage = () => {
        const newLocale = locale === 'en' ? 'vi' : 'en';
        setLocale(newLocale);
        i18n.locale = newLocale; // Cập nhật locale của i18n
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
