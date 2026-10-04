import { AlertTriangle, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hexToRgb, rgbToHsl } from '../../lib/color';
import { evaluateContrast, formatContrastRatio } from '../../lib/contrast';
import ColorInputs from './ColorInputs';

const DEFAULT_FOREGROUND = '#777777';
const DEFAULT_BACKGROUND = '#FFFFFF';

export default function ColorCompareTool() {
  const { t } = useTranslation();
  const [foregroundHex, setForegroundHex] = useState(DEFAULT_FOREGROUND);
  const [backgroundHex, setBackgroundHex] = useState(DEFAULT_BACKGROUND);

  const foregroundRgb = useMemo(() => hexToRgb(foregroundHex), [foregroundHex]);
  const foregroundHsl = useMemo(
    () => (foregroundRgb ? rgbToHsl(foregroundRgb) : null),
    [foregroundRgb],
  );
  const backgroundRgb = useMemo(() => hexToRgb(backgroundHex), [backgroundHex]);
  const backgroundHsl = useMemo(
    () => (backgroundRgb ? rgbToHsl(backgroundRgb) : null),
    [backgroundRgb],
  );

  const contrast = useMemo(() => {
    if (!foregroundRgb || !backgroundRgb) return null;
    return evaluateContrast(foregroundHex, backgroundHex);
  }, [foregroundHex, backgroundHex, foregroundRgb, backgroundRgb]);

  const swap = () => {
    setForegroundHex(backgroundHex);
    setBackgroundHex(foregroundHex);
  };

  const previewFg = contrast?.foreground ?? foregroundHex;
  const previewBg = contrast?.background ?? backgroundHex;
  const inputsValid = Boolean(foregroundRgb && backgroundRgb);

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
      <section className="card" style={{ padding: 16, display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontWeight: 700 }}>{t('pages.compare.foreground')}</div>
          <ColorInputs
            hex={foregroundHex}
            onHexChange={setForegroundHex}
            rgb={foregroundRgb}
            hsl={foregroundHsl}
          />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontWeight: 700 }}>{t('pages.compare.background')}</div>
          <ColorInputs
            hex={backgroundHex}
            onHexChange={setBackgroundHex}
            rgb={backgroundRgb}
            hsl={backgroundHsl}
          />
        </div>
        <button type="button" className="btn" onClick={swap} style={{ width: 'fit-content' }}>
          {t('pages.compare.swap')}
        </button>
      </section>

      <section
        className="card"
        style={{
          padding: 16,
          display: 'grid',
          gap: 12,
          background: inputsValid ? previewBg : 'var(--color-surface)',
          color: inputsValid ? previewFg : 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
        }}
        aria-label={t('pages.compare.previewAria')}
      >
        <div style={{ fontWeight: 700, opacity: inputsValid ? 1 : 0.85 }}>
          {t('pages.compare.previewTitle')}
        </div>
        <p style={{ margin: 0, fontSize: '1.125rem', lineHeight: 1.5 }}>
          {t('pages.compare.sampleText')}
        </p>
      </section>

      <section className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{t('pages.compare.contrast.title')}</div>

        {!inputsValid ? (
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }} role="status">
            {t('pages.compare.contrast.invalidInput')}
          </p>
        ) : contrast ? (
          <>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '1.25rem' }}>
              {formatContrastRatio(contrast.ratio)}
            </div>
            <dl
              style={{
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '8px 16px',
              }}
            >
              <dt style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {t('pages.compare.contrast.aaLabel')}
              </dt>
              <dd style={{ margin: 0 }}>
                {contrast.aaMet
                  ? t('pages.compare.contrast.met')
                  : t('pages.compare.contrast.notMet')}
              </dd>
              <dt style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {t('pages.compare.contrast.aaaLabel')}
              </dt>
              <dd style={{ margin: 0 }}>
                {contrast.aaaMet
                  ? t('pages.compare.contrast.met')
                  : t('pages.compare.contrast.notMet')}
              </dd>
            </dl>

            {contrast.level === 'aa_fail' ? (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-danger)',
                  background: 'var(--color-background-secondary)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <AlertTriangle
                  size={22}
                  strokeWidth={2}
                  aria-hidden
                  style={{ flexShrink: 0, color: 'var(--color-danger)' }}
                />
                <div style={{ display: 'grid', gap: 4 }}>
                  <strong>{t('pages.compare.contrast.aaFailTitle')}</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {t('pages.compare.contrast.aaFailBody')}
                  </span>
                </div>
              </div>
            ) : null}

            {contrast.level === 'aa_pass_aaa_fail' ? (
              <div
                role="status"
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-background-secondary)',
                }}
              >
                <Info
                  size={22}
                  strokeWidth={2}
                  aria-hidden
                  style={{ flexShrink: 0, color: 'var(--color-text-secondary)' }}
                />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {t('pages.compare.contrast.aaaHint')}
                </span>
              </div>
            ) : null}

            {contrast.level === 'aaa_pass' ? (
              <p style={{ margin: 0, color: 'var(--color-success)' }} role="status">
                {t('pages.compare.contrast.allMet')}
              </p>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}
