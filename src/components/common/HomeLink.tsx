import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type HomeLinkProps = {
  to?: string;
  size?: number;
  fixed?: boolean;
};

export default function HomeLink({ to = '/', size = 20, fixed = false }: HomeLinkProps) {
  const fixedStyle: CSSProperties | undefined = fixed
    ? {
        position: 'fixed',
        right: 16,
        bottom: 16,
        insetInlineEnd: 'calc(16px + env(safe-area-inset-right, 0px))',
        insetBlockEnd: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        zIndex: 1040,
      }
    : undefined;

  return (
    <Link
      to={to}
      aria-label="ホームへ"
      title="ホームへ"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 8,
        height: size + 8,
        borderRadius: 999,
        border: '1px solid var(--color-border)',
        background: 'white',
        color: 'var(--color-text-secondary)',
        textDecoration: 'none',
        ...fixedStyle,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    </Link>
  );
}
