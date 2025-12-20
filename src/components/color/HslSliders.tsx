import type { Hsl } from '../../lib/color';

type HslSlidersProps = {
  hsl: Hsl;
  onChange: (partial: Partial<Hsl>) => void;
};

export default function HslSliders({ hsl, onChange }: HslSlidersProps) {
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%' }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Hue: {hsl.h}°</span>
        <input
          type="range"
          min={0}
          max={360}
          value={hsl.h}
          onChange={(e) => onChange({ h: Number(e.target.value) })}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Saturation: {hsl.s}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={hsl.s}
          onChange={(e) => onChange({ s: Number(e.target.value) })}
        />
      </label>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Lightness: {hsl.l}%</span>
        <input
          type="range"
          min={0}
          max={100}
          value={hsl.l}
          onChange={(e) => onChange({ l: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
