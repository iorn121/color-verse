import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageCode = 'ja' | 'en';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language as LanguageCode;

  const change = useCallback(
    (lng: LanguageCode) => {
      if (lng !== current) {
        i18n.changeLanguage(lng);
      }
    },
    [i18n, current],
  );

  const buttonStyle: React.CSSProperties = {
    padding: '6px 10px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-secondary)',
    borderRadius: 6,
    cursor: 'pointer',
  };

  const activeStyle: React.CSSProperties = {
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    fontWeight: 600,
  };

  return (
    <div role="group" aria-label="Language switcher" style={{ display: 'flex', gap: 6 }}>
      <button
        type="button"
        onClick={() => change('ja')}
        style={{ ...buttonStyle, ...(current?.startsWith('ja') ? activeStyle : null) }}
        aria-pressed={current?.startsWith('ja')}
      >
        {t('language.ja')}
      </button>
      <button
        type="button"
        onClick={() => change('en')}
        style={{ ...buttonStyle, ...(current?.startsWith('en') ? activeStyle : null) }}
        aria-pressed={current?.startsWith('en')}
      >
        {t('language.en')}
      </button>
    </div>
  );
}
