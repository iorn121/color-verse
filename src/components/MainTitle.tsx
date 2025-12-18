import type { CSSProperties, ReactNode } from 'react';

type MainTitleProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function MainTitle({ children, className, style }: MainTitleProps) {
  const classes = ['gradient-text', className].filter(Boolean).join(' ');
  return (
    <h1 className={classes} style={style}>
      {children}
    </h1>
  );
}
