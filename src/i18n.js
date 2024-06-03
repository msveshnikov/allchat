import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import zhTranslations from "./locales/zh.json";
import ptTranslations from "./locales/pt.json";
import ruTranslations from "./locales/ru.json";
import jaTranslations from "./locales/ja.json";
import deTranslations from "./locales/de.json";
import frTranslations from "./locales/fr.json";
import itTranslations from "./locales/it.json";
const availableLanguages = ["en", "es", "zh", "pt", "ru", "ja", "de", "fr", "it"];

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: { translation: enTranslations },
            es: { translation: esTranslations },
            zh: { translation: zhTranslations },
            pt: { translation: ptTranslations },
            ru: { translation: ruTranslations },
            ja: { translation: jaTranslations },
            de: { translation: deTranslations },
            fr: { translation: frTranslations },
            it: { translation: itTranslations },
        },
        lng: undefined,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
        detection: {
            order: ["navigator"],
            caches: ["localStorage"],
        },
        supportedLngs: availableLanguages,
    });

export default i18n;
