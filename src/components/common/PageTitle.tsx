import type { PropsWithChildren } from 'react';

type PageTitleProps = PropsWithChildren<{
  title: string;
  className?: string;
  style?: React.CSSProperties;
}>;

export default function PageTitle({ title, className, style }: PageTitleProps) {
  const classes = ['secondary-gradient-text', className].filter(Boolean).join(' ');
  return (
    <h2 className={classes} style={{ margin: 0, ...style }}>
      {title}
    </h2>
  );
}
