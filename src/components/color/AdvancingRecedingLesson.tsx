import { type CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CLASSIC_ADVANCING_HSL,
  CLASSIC_RECEDING_HSL,
  compareDepth,
  type DepthTendency,
  depthTendency,
} from '../../lib/advancingReceding';
import { formatHsl, type Hsl } from '../../lib/color';

type Side = 'left' | 'right';

const circleStyle = (hsl: Hsl, zIndex: number): CSSProperties => ({
  width: 'min(38cqi, 220px)',
  aspectRatio: '1',
  flex: '0 0 auto',
  borderRadius: '50%',
  background: formatHsl(hsl),
  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.18)',
  zIndex,
});

export default function AdvancingRecedingLesson() {
  const { t } = useTranslation();
  const [left, setLeft] = useState<Hsl>(CLASSIC_ADVANCING_HSL);
  const [right, setRight] = useState<Hsl>(CLASSIC_RECEDING_HSL);

  const update = (side: Side, partial: Partial<Hsl>) => {
    const setter = side === 'left' ? setLeft : setRight;
    setter((current) => ({ ...current, ...partial }));
  };

  const swap = () => {
    setLeft(right);
    setRight(left);
  };

  const reset = () => {
    setLeft(CLASSIC_ADVANCING_HSL);
    setRight(CLASSIC_RECEDING_HSL);
  };

  return (
    <section aria-labelledby="advancing-receding-title" style={{ display: 'grid', gap: 16 }}>
      <h3 id="advancing-receding-title" style={{ margin: 0 }}>
        {t('pages.theory.advancingReceding.title')}
      </h3>
      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
        {t('pages.theory.advancingReceding.lead')}
      </p>

      <div
        role="img"
        aria-label={t('pages.theory.advancingReceding.aria.stage')}
        style={{
          containerType: 'inline-size',
          width: '100%',
          background: 'hsl(0, 0%, 50%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: 'clamp(16px, 4cqi, 32px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div aria-hidden style={circleStyle(left, 1)} />
          <div
            aria-hidden
            style={{ ...circleStyle(right, 2), marginLeft: 'clamp(-96px, -14cqi, -28px)' }}
          />
        </div>
      </div>

      <p aria-live="polite" style={{ margin: 0, fontWeight: 600 }}>
        {t(`pages.theory.advancingReceding.comparison.${compareDepth(left, right)}`)}
      </p>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
        }}
      >
        <ColorControls side="left" hsl={left} onChange={(partial) => update('left', partial)} />
        <ColorControls side="right" hsl={right} onChange={(partial) => update('right', partial)} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button className="btn btn-primary" type="button" onClick={swap}>
          {t('pages.theory.advancingReceding.swap')}
        </button>
        <button
          className="btn"
          type="button"
          onClick={reset}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('pages.theory.advancingReceding.reset')}
        </button>
      </div>

      <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
        {t('pages.theory.advancingReceding.note')}
      </p>
    </section>
  );
}

function ColorControls({
  side,
  hsl,
  onChange,
}: {
  side: Side;
  hsl: Hsl;
  onChange: (partial: Partial<Hsl>) => void;
}) {
  const { t } = useTranslation();
  const tendency: DepthTendency = depthTendency(hsl);
  const legend = t(`pages.theory.advancingReceding.sides.${side}`);

  return (
    <fieldset
      style={{
        margin: 0,
        minWidth: 0,
        display: 'grid',
        gap: 10,
        padding: 12,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface)',
      }}
    >
      <legend style={{ padding: '0 6px', fontWeight: 600 }}>{legend}</legend>
      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
        {t(`pages.theory.advancingReceding.tendency.${tendency}`)}
      </span>
      <ChannelSlider
        label={t('pages.theory.advancingReceding.hue')}
        valueLabel={t('pages.theory.advancingReceding.valueHue', { value: hsl.h })}
        min={0}
        max={360}
        value={hsl.h}
        onChange={(h) => onChange({ h })}
      />
      <ChannelSlider
        label={t('pages.theory.advancingReceding.saturation')}
        valueLabel={t('pages.theory.advancingReceding.valuePercent', { value: hsl.s })}
        min={0}
        max={100}
        value={hsl.s}
        onChange={(s) => onChange({ s })}
      />
      <ChannelSlider
        label={t('pages.theory.advancingReceding.lightness')}
        valueLabel={t('pages.theory.advancingReceding.valuePercent', { value: hsl.l })}
        min={0}
        max={100}
        value={hsl.l}
        onChange={(l) => onChange({ l })}
      />
    </fieldset>
  );
}

function ChannelSlider({
  label,
  valueLabel,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <span>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-primary)' }}>
          {valueLabel}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-valuetext={valueLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ width: '100%' }}
      />
    </label>
  );
}
