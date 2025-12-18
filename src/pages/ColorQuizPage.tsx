import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import Description from '../components/common/Description';
import JisColorLabel from '../components/common/JisColorLabel';
import PageTitle from '../components/common/PageTitle';
import type { JisColor } from '../lib/jisColors';
import { getRandomInt, pickRandom } from '../lib/jisColors';

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
  const allColors = useLoaderData() as JisColor[];
  const [selected, setSelected] = useState<string | null>(null); // hex|name
  const [turn, setTurn] = useState(0); // 出題更新用のシード

  const colors = useMemo(
    () => (Array.isArray(allColors) ? allColors.filter((d) => /^#[0-9A-F]{6}$/.test(d.hex)) : []),
    [allColors],
  );

  const question = useMemo<Question | null>(() => {
    // turn は再出題トリガーとして使用
    void turn;
    if (!colors || colors.length < 4) return null;
    return buildQuestion(colors, mode);
  }, [colors, mode, turn]);

  const handleAnswer = (opt: JisColor) => {
    if (!question || selected) return;
    setSelected(`${opt.hex}|${opt.name}`);
  };

  const next = () => {
    setSelected(null);
    setTurn((t) => t + 1);
  };

  const isCorrect = useMemo(() => {
    if (!question || !selected) return null;
    const [hex, name] = selected.split('|');
    return hex === question.correct.hex && name === question.correct.name;
  }, [question, selected]);

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title="JIS慣用色クイズ" />
      <Description>モードを選んでクイズに挑戦しましょう。</Description>

      <div className="flex items-center gap-sm" role="tablist" aria-label="クイズモード">
        <button
          role="tab"
          aria-selected={mode === 'name-to-color'}
          className="btn"
          style={{
            background:
              mode === 'name-to-color'
                ? 'var(--color-background-tertiary)'
                : 'var(--color-background)',
            border:
              mode === 'name-to-color'
                ? '1px solid var(--color-border-hover)'
                : '1px solid var(--color-border)',
          }}
          onClick={() => {
            setMode('name-to-color');
            setSelected(null);
            setTurn((t) => t + 1);
          }}
        >
          色名 → 色
        </button>
        <button
          role="tab"
          aria-selected={mode === 'color-to-name'}
          className="btn"
          style={{
            background:
              mode === 'color-to-name'
                ? 'var(--color-background-tertiary)'
                : 'var(--color-background)',
            border:
              mode === 'color-to-name'
                ? '1px solid var(--color-border-hover)'
                : '1px solid var(--color-border)',
          }}
          onClick={() => {
            setMode('color-to-name');
            setSelected(null);
            setTurn((t) => t + 1);
          }}
        >
          色 → 色名
        </button>
      </div>

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
    </div>
  );
}
