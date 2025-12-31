import type { CSSProperties } from 'react';

import type { Hex } from '../../lib/color';
import ColorSwatch from './ColorSwatch';

type BasicColor = {
  name: string;
  hex: Hex; // #RRGGBB
};

type JisColorLabelProps = {
  color: BasicColor;
  showSwatch?: boolean;
  align?: 'start' | 'center' | 'end';
};

export default function JisColorLabel({
  color,
  showSwatch = false,
  align = 'start',
}: JisColorLabelProps) {
  const container: CSSProperties = {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'end' ? 'end' : 'start',
    gap: 8,
  };

  return (
    <div style={container}>
      {showSwatch && <ColorSwatch color={color.hex} width={14} height={14} radius={3} />}
      <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
        <span style={{ fontWeight: 600 }}>{color.name}</span>
        <span style={{ opacity: 0.7, fontFamily: 'monospace' }}>{color.hex}</span>
      </span>
    </div>
  );
}
