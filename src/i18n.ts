import { createInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// このアプリでは public/locales/{lng}/{ns}.json から辞書を読み込みます。
// 初期ロードは 'common' のみ。必要になったら名前空間を増やせます。
const i18n = createInstance();
const urlLng =
  typeof window !== 'undefined'
    ? (new URL(window.location.href).searchParams.get('lng') ?? undefined)
    : undefined;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: 'ja',
    supportedLngs: ['ja', 'en'],
    nonExplicitSupportedLngs: true,
    ns: ['common'],
    defaultNS: 'common',
    lng: urlLng, // URLで指定があれば最優先
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // クエリ > localStorage > ブラウザ > <html lang> の順に検出
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
    },
    backend: {
      // Vite の BASE_URL 配下を考慮
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    react: {
      useSuspense: false,
    },
  });

// <html lang> を現在の言語に同期
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
