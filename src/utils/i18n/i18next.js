import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationES from "./locales/es/translate.json"

const resources = {
  es: {
    translation: translationES
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    },
    // debug: true,
  });

export default i18n;