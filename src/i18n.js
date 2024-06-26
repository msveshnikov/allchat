import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import zhTranslations from "./locales/zh.json";
import arTranslations from "./locales/ar.json";
import hiTranslations from "./locales/hi.json";
import ptTranslations from "./locales/pt.json";
import bnTranslations from "./locales/bn.json";
import ruTranslations from "./locales/ru.json";
import jaTranslations from "./locales/ja.json";
import deTranslations from "./locales/de.json";
import frTranslations from "./locales/fr.json";
import itTranslations from "./locales/it.json";
const availableLanguages = ["en", "es", "zh", "ar", "hi", "pt", "bn", "ru", "ja", "de", "fr", "it"];

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: { translation: enTranslations },
            es: { translation: esTranslations },
            zh: { translation: zhTranslations },
            ar: { translation: arTranslations },
            hi: { translation: hiTranslations },
            pt: { translation: ptTranslations },
            bn: { translation: bnTranslations },
            ru: { translation: ruTranslations },
            ja: { translation: jaTranslations },
            de: { translation: deTranslations },
            fr: { translation: frTranslations },
            it: { translation: itTranslations },
        },
        lng: undefined, // Let the LanguageDetector determine the initial language
        fallbackLng: "en", // Fallback language
        interpolation: { escapeValue: false },
        detection: {
            order: ["navigator"], // Try to detect the language from the browser
            caches: ["localStorage"], // Cache the detected language in localStorage
        },
        supportedLngs: availableLanguages, // List of supported languages
    });

export default i18n;
