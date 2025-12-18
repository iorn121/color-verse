import type { CSSProperties } from 'react';

type BasicColor = {
  name: string;
  hex: string; // #RRGGBB
};

type JisColorLabelProps = {
  color: BasicColor;
  showSwatch?: boolean;
  align?: 'start' | 'center' | 'end';
  className?: string;
  style?: CSSProperties;
};

export default function JisColorLabel({
  color,
  showSwatch = false,
  align = 'start',
  className,
  style,
}: JisColorLabelProps) {
  const container: CSSProperties = {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : align === 'end' ? 'end' : 'start',
    gap: 8,
    ...style,
  };

  return (
    <div className={className} style={container}>
      {showSwatch && (
        <span
          aria-hidden
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: color.hex,
            border: '1px solid var(--color-border)',
          }}
        />
      )}
      <span style={{ display: 'grid', gap: 2, textAlign: 'left' }}>
        <span style={{ fontWeight: 600 }}>{color.name}</span>
        <span style={{ opacity: 0.7, fontFamily: 'monospace' }}>{color.hex}</span>
      </span>
    </div>
  );
}
