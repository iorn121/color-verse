import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import ColorSwatch from '../components/common/ColorSwatch';
import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import JisColorLabel from '../components/common/JisColorLabel';
import PageTitle from '../components/common/PageTitle';
import QuizModeTabs from '../components/common/QuizModeTabs';
import { useColorQuiz } from '../hooks/useColorQuiz';
import type { JisColor } from '../lib/jisColors';

type Mode = 'name-to-color' | 'color-to-name';

export default function ColorQuizPage() {
  const [mode, setMode] = useState<Mode>('name-to-color');
  const allColors = useLoaderData() as JisColor[];

  const colors = useMemo(
    () => (Array.isArray(allColors) ? allColors.filter((d) => /^#[0-9A-F]{6}$/.test(d.hex)) : []),
    [allColors],
  );

  const {
    question,
    selectedKey: selected,
    isCorrect,
    handleAnswer,
    next,
  } = useColorQuiz(colors, mode);

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title="JIS慣用色クイズ" />
      <Description>モードを選んでクイズに挑戦しましょう。</Description>

      <QuizModeTabs
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: 'name-to-color', label: '色名 → 色' },
          { value: 'color-to-name', label: '色 → 色名' },
        ]}
        ariaLabel="クイズモード"
      />

      <section aria-live="polite" style={{ display: 'grid', gap: 12 }}>
        {!question && <p>読み込み中…</p>}

        {question && (
          <div style={{ display: 'grid', gap: 12 }}>
            {question.mode === 'name-to-color' ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <JisColorLabel color={question.correct} />
                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
                  }}
                >
                  {question.options.map((opt) => (
                    <button
                      key={`${opt.hex}|${opt.name}`}
                      onClick={() => handleAnswer(opt)}
                      className="card"
                      style={{
                        padding: 0,
                        height: 96,
                        border: selected
                          ? opt.hex === question.correct.hex && opt.name === question.correct.name
                            ? '2px solid var(--color-success)'
                            : `${opt.hex}|${opt.name}` === selected
                              ? '2px solid var(--color-danger)'
                              : '1px solid var(--color-border)'
                          : '1px solid var(--color-border)',
                        overflow: 'hidden',
                      }}
                      aria-pressed={selected ? `${opt.hex}|${opt.name}` === selected : undefined}
                    >
                      <ColorSwatch color={opt.hex} height={96} showBorder={false} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                <ColorSwatch
                  color={question.correct.hex}
                  height={120}
                  ariaLabel={`問題の色 ${question.correct.hex}`}
                />
                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
                  }}
                >
                  {question.options.map((opt) => (
                    <button
                      key={`${opt.hex}|${opt.name}`}
                      onClick={() => handleAnswer(opt)}
                      className="card"
                      style={{
                        padding: 12,
                        textAlign: 'left',
                        border: selected
                          ? opt.hex === question.correct.hex && opt.name === question.correct.name
                            ? '2px solid var(--color-success)'
                            : `${opt.hex}|${opt.name}` === selected
                              ? '2px solid var(--color-danger)'
                              : '1px solid var(--color-border)'
                          : '1px solid var(--color-border)',
                      }}
                      aria-pressed={selected ? `${opt.hex}|${opt.name}` === selected : undefined}
                    >
                      <JisColorLabel color={opt} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selected && (
              <div className="flex items-center gap-sm" role="status">
                <span
                  style={{
                    fontWeight: 700,
                    color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
                  }}
                >
                  {isCorrect ? '正解！' : '不正解'}
                </span>
              </div>
            )}

            <div>
              <button className="btn" onClick={next}>
                次の問題へ
              </button>
            </div>
          </div>
        )}
      </section>
      <HomeLink fixed />
    </div>
  );
}
