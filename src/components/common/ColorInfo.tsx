import type { Hsl, Rgb } from '../../lib/color';

type ColorInfoProps = {
  title?: string;
  hex: string | null;
  rgb: Rgb | null;
  hsl: Hsl | null;
};

export default function ColorInfo({ title, hex, rgb, hsl }: ColorInfoProps) {
  return (
    <div className="card" style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
      {title && <div style={{ fontWeight: 700 }}>{title}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: hex ?? '#000',
          }}
        />
        <div style={{ display: 'grid', gap: 4 }}>
          <div>
            Hex: <code>{hex ?? '-'}</code>
          </div>
          <div>
            RGB: <code>{rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '-'}</code>
          </div>
          <div>
            HSL: <code>{hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '-'}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
