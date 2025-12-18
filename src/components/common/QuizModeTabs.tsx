type Option<T extends string> = { value: T; label: string };

type QuizModeTabsProps<T extends string> = {
  value: T;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

export default function QuizModeTabs<T extends string>({
  value,
  options,
  onChange,
  ariaLabel = 'モード選択',
}: QuizModeTabsProps<T>) {
  return (
    <div className="flex items-center gap-sm" role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            className="btn"
            style={{
              background: active ? 'var(--color-background-tertiary)' : 'var(--color-background)',
              border: active
                ? '1px solid var(--color-border-hover)'
                : '1px solid var(--color-border)',
            }}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
