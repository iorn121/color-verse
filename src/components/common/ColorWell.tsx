import type { CSSProperties } from 'react';

type ColorWellProps = {
  value: string;
  onChange: (hex: string) => void;
  size?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

export default function ColorWell({
  value,
  onChange,
  size = 48,
  ariaLabel = 'color',
  className,
  style,
}: ColorWellProps) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={className}
      style={{
        width: size,
        height: size,
        border: 'none',
        padding: 0,
        background: 'transparent',
        ...style,
      }}
    />
  );
}
