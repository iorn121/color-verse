import type { CSSProperties } from 'react';

type ColorSwatchProps = {
  color: string;
  width?: number | string;
  height?: number;
  radius?: number;
  showBorder?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export default function ColorSwatch({
  color,
  width = '100%',
  height = 84,
  radius = 8,
  showBorder = true,
  ariaLabel,
  className,
  style,
}: ColorSwatchProps) {
  const swatchStyle: CSSProperties = {
    width,
    height,
    borderRadius: radius,
    background: color,
    border: showBorder ? '1px solid var(--color-border)' : undefined,
    ...style,
  };
  return <div aria-label={ariaLabel} className={className} style={swatchStyle} />;
}
