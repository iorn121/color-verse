import { useFavorites } from '../../hooks/useFavorites';
import type { Hex } from '../../lib/color';

type FavoriteButtonProps = {
  hex: Hex;
  size?: number;
};

export default function FavoriteButton({ hex, size = 20 }: FavoriteButtonProps) {
  const { has, toggle } = useFavorites();
  const active = has(hex);

  return (
    <button
      type="button"
      aria-label="お気に入りに登録"
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        toggle(hex);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 8,
        height: size + 8,
        borderRadius: 999,
        border: '1px solid var(--color-border)',
        background: 'white',
        color: active ? '#ef4444' : 'var(--color-text-secondary)',
        cursor: 'pointer',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    </button>
  );
}
