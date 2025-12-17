import { useEffect, useMemo, useState } from 'react';

import type { JisColor } from '../lib/jisColors';
import { getRandomInt, loadJisColors, pickRandom } from '../lib/jisColors';

type Mode = 'name-to-color' | 'color-to-name';

type Question = {
  mode: Mode;
  correct: JisColor;
  options: JisColor[]; // 4択
};

function buildQuestion(colors: JisColor[], mode: Mode): Question {
  const correct = colors[getRandomInt(colors.length)];
  // 同じ色が候補に重複しないようにランダム抽出
  const distractors = pickRandom(
    colors.filter((c) => c.hex !== correct.hex || c.name !== correct.name),
    3,
  );
  const options = [...distractors, correct];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { mode, correct, options };
}

export default function ColorQuizPage() {
  const [mode, setMode] = useState<Mode>('name-to-color');
  const [allColors, setAllColors] = useState<JisColor[] | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // hex or nameではなく識別用にhex+name連結
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    loadJisColors(ac.signal)
      .then((data) => {
        const filtered = data.filter((d) => /^#[0-9A-F]{6}$/.test(d.hex));
        setAllColors(filtered);
      })
      .catch((e) => {
        // React 18 StrictModeの開発時ダブルマウントでAbortErrorが発生する場合がある
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.error(e);
        setAllColors([]);
      });
    return () => ac.abort();
  }, []);

  useEffect(() => {
    if (!allColors || allColors.length < 4) return;
    setQuestion(buildQuestion(allColors, mode));
    setSelected(null);
    setIsCorrect(null);
  }, [allColors, mode]);

  const title = useMemo(
    () => (mode === 'name-to-color' ? '色名 → 色（4択）' : '色 → 色名（4択）'),
    [mode],
  );

  const handleAnswer = (opt: JisColor) => {
    if (!question) return;
    if (selected) return; // 一問一答
    const correct = opt.hex === question.correct.hex && opt.name === question.correct.name;
    setSelected(`${opt.hex}|${opt.name}`);
    setIsCorrect(correct);
  };

  const next = () => {
    if (!allColors) return;
    setQuestion(buildQuestion(allColors, mode));
    setSelected(null);
    setIsCorrect(null);
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <h1 className="gradient-text" style={{ marginBottom: 0 }}>
        JIS慣用色クイズ
      </h1>
      <p style={{ marginTop: 0 }}>モードを選んでクイズに挑戦しましょう。</p>

      <div className="flex items-center gap-sm" role="tablist" aria-label="クイズモード">
        <button
          role="tab"
          aria-selected={mode === 'name-to-color'}
          className="btn"
          style={{
            background: mode === 'name-to-color' ? 'var(--color-primary-ghost)' : 'transparent',
            border: '1px solid var(--color-border)',
          }}
          onClick={() => setMode('name-to-color')}
        >
          色名 → 色
        </button>
        <button
          role="tab"
          aria-selected={mode === 'color-to-name'}
          className="btn"
          style={{
            background: mode === 'color-to-name' ? 'var(--color-primary-ghost)' : 'transparent',
            border: '1px solid var(--color-border)',
          }}
          onClick={() => setMode('color-to-name')}
        >
          色 → 色名
        </button>
      </div>

      <section aria-live="polite" style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
        {!question && <p>読み込み中…</p>}

        {question && (
          <div style={{ display: 'grid', gap: 12 }}>
            {question.mode === 'name-to-color' ? (
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{question.correct.name}</div>
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
                        border:
                          selected && `${opt.hex}|${opt.name}` === selected
                            ? `2px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`
                            : '1px solid var(--color-border)',
                        overflow: 'hidden',
                      }}
                      aria-pressed={selected ? `${opt.hex}|${opt.name}` === selected : undefined}
                    >
                      <div style={{ background: opt.hex, width: '100%', height: '100%' }} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                <div
                  aria-label={`問題の色 ${question.correct.hex}`}
                  style={{
                    width: '100%',
                    height: 120,
                    border: '1px solid var(--color-border)',
                    background: question.correct.hex,
                    borderRadius: 8,
                  }}
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
                        border:
                          selected && `${opt.hex}|${opt.name}` === selected
                            ? `2px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`
                            : '1px solid var(--color-border)',
                      }}
                      aria-pressed={selected ? `${opt.hex}|${opt.name}` === selected : undefined}
                    >
                      <div style={{ fontWeight: 600 }}>{opt.name}</div>
                      <div style={{ opacity: 0.7, fontFamily: 'monospace' }}>{opt.hex}</div>
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
                {!isCorrect && (
                  <span>
                    正解は「{question.correct.name}」（{question.correct.hex}）
                  </span>
                )}
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
    </div>
  );
}
