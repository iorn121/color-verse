import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  analyzeImageFile,
  type DominantColor,
  type PaletteAnalysisWithBackground,
} from '../../lib/imagePaletteAnalysis';

export default function ImagePaletteAnalyzer() {
  const { t } = useTranslation();
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PaletteAnalysisWithBackground | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const onFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setToast(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    try {
      const data = await analyzeImageFile(file);
      setResult(data);
    } catch {
      setToast(t('pages.colorAnalysis.error'));
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } finally {
      setBusy(false);
    }
  }, [t]);

  const copyHex = useCallback(
    async (hex: string) => {
      try {
        await navigator.clipboard.writeText(hex);
        setToast(t('pages.colorAnalysis.copied', { hex }));
      } catch {
        setToast(t('pages.colorAnalysis.copyFailed'));
      }
    },
    [t],
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <label htmlFor={inputId} style={{ display: 'grid', gap: 6 }}>
        <span>{t('pages.colorAnalysis.pickImage')}</span>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            void onFile(file);
            e.target.value = '';
          }}
        />
      </label>

      <div aria-live="polite" style={{ minHeight: 22, color: 'var(--color-text-secondary)' }}>
        {toast}
      </div>

      {busy && (
        <div className="flex items-center gap-sm" style={{ color: 'var(--color-text-secondary)' }}>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
            style={{ display: 'inline-flex' }}
          >
            <Loader2 size={28} aria-hidden />
          </motion.span>
          <span>{t('pages.colorAnalysis.analyzing')}</span>
        </div>
      )}

      {previewUrl && !busy && (
        <img
          src={previewUrl}
          alt=""
          style={{
            maxWidth: '100%',
            maxHeight: 280,
            objectFit: 'contain',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
          }}
        />
      )}

      {result && (
        <div style={{ display: 'grid', gap: 20 }}>
          <section style={{ display: 'grid', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{t('pages.colorAnalysis.average')}</h2>
            <AverageSwatch hex={result.average_color} onCopy={() => copyHex(result.average_color)} />
          </section>

          <section style={{ display: 'grid', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{t('pages.colorAnalysis.palette')}</h2>
            {result.dominant_colors.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                {t('pages.colorAnalysis.noDominant')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-md">
                {result.dominant_colors.map((c) => (
                  <ColorChip key={c.hex} color={c} onCopy={() => copyHex(c.hex)} />
                ))}
              </div>
            )}
          </section>

          {result.background_colors.length > 0 && (
            <section style={{ display: 'grid', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{t('pages.colorAnalysis.background')}</h2>
              <div className="flex flex-wrap gap-md">
                {result.background_colors.map((c, i) => (
                  <ColorChip key={`bg-${i}`} color={c} onCopy={() => copyHex(c.hex)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AverageSwatch({ hex, onCopy }: { hex: string; onCopy: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: hex,
          border: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{hex}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)', fontSize: 13 }}>
        {t('pages.colorAnalysis.clickCopy')}
      </span>
    </button>
  );
}

function ColorChip({ color, onCopy }: { color: DominantColor; onCopy: () => void }) {
  const { t } = useTranslation();
  const label = t(`pages.colorAnalysis.types.${color.type}`);
  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn"
      title={t('pages.colorAnalysis.clickCopy')}
      style={{
        display: 'grid',
        gap: 6,
        padding: 10,
        minWidth: 120,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <span
        style={{
          width: '100%',
          aspectRatio: '1.6',
          borderRadius: 6,
          backgroundColor: color.hex,
          border: '1px solid var(--color-border)',
        }}
      />
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}>{color.hex}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
        {label} · {(color.population * 100).toFixed(1)}%
      </span>
      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
        HSL {color.hsl[0]}, {color.hsl[1]}%, {color.hsl[2]}%
      </span>
    </button>
  );
}
