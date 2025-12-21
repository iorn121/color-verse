import { useMemo, useState } from 'react';

import type { Hsl, Rgb } from '../lib/color';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from '../lib/color';
import ColorInputs from './color/ColorInputs';
import HslSliders from './color/HslSliders';
import FavoriteButton from './common/FavoriteButton';

export default function ColorPicker() {
  const [hex, setHex] = useState('#4F46E5');

  const rgb: Rgb | null = useMemo(() => hexToRgb(hex), [hex]);
  const hsl: Hsl | null = useMemo(() => (rgb ? rgbToHsl(rgb) : null), [rgb]);

  const updateFromHsl = (next: Partial<Hsl>) => {
    if (!hsl) return;
    const merged: Hsl = {
      h: next.h ?? hsl.h,
      s: next.s ?? hsl.s,
      l: next.l ?? hsl.l,
    };
    const toRgb = hslToRgb(merged);
    setHex(rgbToHex(toRgb));
  };

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ColorInputs hex={hex} onHexChange={setHex} rgb={rgb} hsl={hsl} />
        <FavoriteButton hex={hex} />
      </div>

      {hsl && <HslSliders hsl={hsl} onChange={updateFromHsl} />}
    </div>
  );
}
