import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
    // Load translations using http backend
    .use(HttpBackend)
    // Detect user language from browser settings, query string, etc.
    .use(LanguageDetector)
    // Pass i18n instance to react-i18next.
    .use(initReactI18next)
    .init({
        fallbackLng: 'en', // default language
        debug: true, // Disable in production
        interpolation: {
            escapeValue: false, // not needed for React as it escapes by default
        },
        backend: {
            // The translation files should be served from public/locales folder
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
    });

export default i18n;
