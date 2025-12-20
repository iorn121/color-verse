import type { Hsl, Rgb } from '../../lib/color';
import { formatHsl, formatRgb } from '../../lib/color';
import ColorSwatch from './ColorSwatch';

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
        <ColorSwatch color={hex ?? '#000'} width={40} height={40} radius={8} />
        <div style={{ display: 'grid', gap: 4 }}>
          <div>
            Hex: <code>{hex ?? '-'}</code>
          </div>
          <div>
            RGB:
            <code>{formatRgb(rgb)}</code>
          </div>
          <div>
            HSL: <code>{formatHsl(hsl, '-')}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
