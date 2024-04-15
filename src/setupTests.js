// Mock react-i18next
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    }),
    initReactI18next: () => null,
}));
