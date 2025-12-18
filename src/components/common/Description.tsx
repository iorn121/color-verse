import type { PropsWithChildren } from 'react';

type DescriptionProps = PropsWithChildren<{
  style?: React.CSSProperties;
  className?: string;
}>;

export default function Description({ children, style, className }: DescriptionProps) {
  const classes = [className].filter(Boolean).join(' ');
  return (
    <p className={classes} style={{ margin: 0, color: 'var(--color-text-secondary)', ...style }}>
      {children}
    </p>
  );
}
