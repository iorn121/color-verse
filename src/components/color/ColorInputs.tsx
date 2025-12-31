import type { Hex, Hsl, Rgb } from '../../lib/color';
import { formatHsl, formatRgb } from '../../lib/color';
import ColorWell from '../common/ColorWell';

type ColorInputsProps = {
  hex: Hex;
  onHexChange: (next: Hex) => void;
  rgb: Rgb | null;
  hsl: Hsl | null;
};

export default function ColorInputs({ hex, onHexChange, rgb, hsl }: ColorInputsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: 8,
        minWidth: 0,
      }}
    >
      <ColorWell value={hex} onChange={onHexChange} ariaLabel="color" size={48} />
      <input
        value={hex}
        onChange={(e) => onHexChange(e.target.value)}
        aria-label="hex"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          padding: '8px 10px',
          width: 140,
          minWidth: 120,
        }}
      />
      <div
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {formatRgb(rgb)}
      </div>
      <div
        style={{
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {formatHsl(hsl)}
      </div>
    </div>
  );
}
