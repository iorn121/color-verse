import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Description from '../components/common/Description';
import HomeLink from '../components/common/HomeLink';
import PageTitle from '../components/common/PageTitle';
import {
  DEFAULT_ALPHA,
  DEFAULT_L,
  DEFAULT_S,
  generatePuzzle,
  HUES,
  isPlacementValid,
  type Puzzle,
  type Tile,
  type TilePos,
} from '../lib/prismatrix';

type Feedback = {
  exact: number;
  hueOnly: number;
  complete: boolean;
} | null;

type SolutionPhase = 'base' | 'glow' | 'reveal';

function hueLabel(h: number): string {
  return `${h}°`;
}

function tileCoversCell(tile: TilePos, cellX: number, cellY: number): boolean {
  return cellX >= tile.x && cellX <= tile.x + 1 && cellY >= tile.y && cellY <= tile.y + 1;
}

function buildGuessTiles(placed: Map<number, TilePos>): Tile[] {
  const tiles: Tile[] = [];
  for (const [hue, pos] of placed.entries()) {
    if (!HUES.includes(hue as (typeof HUES)[number])) continue;
    tiles.push({ hue: hue as (typeof HUES)[number], x: pos.x, y: pos.y });
  }
  return tiles;
}

function sortTilesTopDown(tiles: Tile[]): Tile[] {
  return tiles
    .slice()
    .sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x !== b.x ? a.x - b.x : a.hue - b.hue));
}

function rgbCss(c: { r: number; g: number; b: number }): string {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

const STACK_OFFSETS: { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: 8, y: -6 },
  { x: -8, y: 6 },
  { x: 12, y: 8 },
  { x: -12, y: -8 },
];

export default function PrismatrixPage() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selected, setSelected] = useState<(typeof HUES)[number][]>([]);
  const [activeHue, setActiveHue] = useState<(typeof HUES)[number] | null>(null);
  const [placed, setPlaced] = useState<Map<number, TilePos>>(new Map());
  const [message, setMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionRunId, setSolutionRunId] = useState(0);

  const maxOverlap = 3;

  useEffect(() => {
    const p = generatePuzzle({ maxOverlap, requireOverlap: true, uniquenessTrials: 500 });
    setPuzzle(p);
  }, []);

  const guessTiles = useMemo(() => buildGuessTiles(placed), [placed]);
  const guessValid = useMemo(() => isPlacementValid(guessTiles, maxOverlap), [guessTiles]);

  const clearStateForNewPuzzle = (p: Puzzle) => {
    setPuzzle(p);
    setSelected([]);
    setActiveHue(null);
    setPlaced(new Map());
    setMessage(null);
    setFeedback(null);
    setShowSolution(false);
    setSolutionRunId(0);
  };

  const onNewPuzzle = () => {
    try {
      const p = generatePuzzle({ maxOverlap, requireOverlap: true, uniquenessTrials: 500 });
      clearStateForNewPuzzle(p);
    } catch {
      setMessage(t('pages.prismatrix.messages.generateFailed'));
    }
  };

  const toggleSelectHue = (hue: (typeof HUES)[number]) => {
    setMessage(null);
    setFeedback(null);
    setShowSolution(false);

    setSelected((prev) => {
      const has = prev.includes(hue);
      if (has) {
        const next = prev.filter((h) => h !== hue);
        setPlaced((p) => {
          const np = new Map(p);
          np.delete(hue);
          return np;
        });
        setActiveHue((a) => (a === hue ? (next.length ? next[0] : null) : a));
        return next;
      }

      // Switch active hue: if the previous active hue was only "selected" but not placed,
      // automatically unselect it to avoid leaving unplaced selections around.
      const prevActive = activeHue;
      const shouldDropPrevActive =
        prevActive !== null &&
        prevActive !== hue &&
        prev.includes(prevActive) &&
        !placed.has(prevActive);
      const base = shouldDropPrevActive ? prev.filter((h) => h !== prevActive) : prev;

      if (base.length >= 6) {
        setMessage(t('pages.prismatrix.messages.selectUpToSix'));
        return prev;
      }
      const next = [...base, hue];
      setActiveHue(hue);
      return next;
    });
  };

  const placeActiveAt = (x: number, y: number) => {
    setMessage(null);
    setFeedback(null);
    setShowSolution(false);

    if (activeHue === null) {
      setMessage(t('pages.prismatrix.messages.pickActiveTile'));
      return;
    }
    if (!selected.includes(activeHue)) {
      setMessage(t('pages.prismatrix.messages.pickFromSelected'));
      return;
    }
    if (x > 2 || y > 2) {
      setMessage(t('pages.prismatrix.messages.invalidTopLeft'));
      return;
    }
    const pos: TilePos = { x: x as 0 | 1 | 2, y: y as 0 | 1 | 2 };

    setPlaced((prev) => {
      const next = new Map(prev);
      next.set(activeHue, pos);
      const tiles = buildGuessTiles(next);
      if (!isPlacementValid(tiles, maxOverlap)) {
        setMessage(t('pages.prismatrix.messages.overlapExceeded', { max: maxOverlap }));
        return prev;
      }
      return next;
    });
  };

  const onResetAnswer = () => {
    setSelected([]);
    setActiveHue(null);
    setPlaced(new Map());
    setFeedback(null);
    setMessage(null);
    setShowSolution(false);
  };

  const onCheck = () => {
    if (!puzzle) return;

    const selectedSet = new Set<number>(selected);
    const solutionSet = new Set<number>(puzzle.tiles.map((x) => x.hue));

    let hueOnly = 0;
    for (const h of selectedSet) if (solutionSet.has(h)) hueOnly++;

    let exact = 0;
    for (const tile of puzzle.tiles) {
      const guess = placed.get(tile.hue);
      if (guess && guess.x === tile.x && guess.y === tile.y) exact++;
    }

    const complete = exact === 6 && hueOnly === 6 && placed.size === 6;
    setFeedback({ exact, hueOnly, complete });
    if (placed.size < 6) {
      setMessage(t('pages.prismatrix.messages.placeAllSix'));
    } else if (selected.length < 6) {
      setMessage(t('pages.prismatrix.messages.selectSix'));
    } else {
      setMessage(null);
    }
  };

  const boardCellSize = 56;
  const boardGap = 6;
  const boardPitch = boardCellSize + boardGap;

  const SolutionDecomposeBoard = ({
    puzzle: p,
    correct,
    runId,
  }: {
    puzzle: Puzzle;
    correct: boolean;
    runId: number;
  }) => {
    const tiles = useMemo(() => sortTilesTopDown(p.tiles), [p.tiles]);
    const tilePresentations = useMemo(() => {
      const seen = new Map<string, number>();
      return tiles.map((tile) => {
        const key = `${tile.x},${tile.y}`;
        const idx = seen.get(key) ?? 0;
        seen.set(key, idx + 1);
        const base = STACK_OFFSETS[idx % STACK_OFFSETS.length] ?? { x: 0, y: 0 };
        const bump = Math.floor(idx / STACK_OFFSETS.length) * 3;
        const sign = idx % 2 === 0 ? 1 : -1;
        return {
          tile,
          stackIndex: idx,
          offsetX: base.x + sign * bump,
          offsetY: base.y - sign * bump,
        };
      });
    }, [tiles]);
    const alpha = Math.min(0.55, DEFAULT_ALPHA + 0.18);

    const [phase, setPhase] = useState<SolutionPhase>('base');
    const timeoutsRef = useRef<number[]>([]);

    useEffect(() => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];

      if (prefersReducedMotion) {
        setPhase('reveal');
        return;
      }

      setPhase('base');
      timeoutsRef.current.push(window.setTimeout(() => setPhase('glow'), 80));
      timeoutsRef.current.push(window.setTimeout(() => setPhase('reveal'), 520));

      return () => {
        timeoutsRef.current.forEach((id) => window.clearTimeout(id));
        timeoutsRef.current = [];
      };
    }, [runId]);

    const size = boardPitch * 4 - boardGap;

    return (
      <div style={{ display: 'grid', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {t('pages.prismatrix.solutionHint')}
        </p>

        <div className="card" style={{ padding: 12 }}>
          <motion.div
            aria-label={t('pages.prismatrix.aria.solutionBoard')}
            style={{
              position: 'relative',
              width: size,
              height: size,
              marginInline: 'auto',
              borderRadius: 14,
              overflow: 'hidden',
              border: correct ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              boxShadow:
                correct && phase === 'reveal'
                  ? [
                      '0 0 0 0 rgba(16,185,129,0.0)',
                      '0 0 0 10px rgba(16,185,129,0.18)',
                      '0 0 0 0 rgba(16,185,129,0.0)',
                    ]
                  : phase === 'glow'
                    ? '0 0 0 0 rgba(0,0,0,0), 0 0 26px rgba(99,102,241,0.22), 0 0 12px rgba(236,72,153,0.14)'
                    : '0 0 0 0 rgba(0,0,0,0)',
            }}
            transition={{
              duration: correct && phase === 'reveal' ? 0.9 : 0.38,
              ease: 'easeOut',
            }}
          >
            {/* completed board */}
            <div
              role="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(4, ${boardCellSize}px)`,
                gridTemplateRows: `repeat(4, ${boardCellSize}px)`,
                gap: boardGap,
                justifyContent: 'center',
                padding: 0,
                position: 'absolute',
                inset: 0,
              }}
            >
              {Array.from({ length: 16 }, (_, i) => {
                const c = p.board[i] ?? { r: 255, g: 255, b: 255 };
                return (
                  <div
                    key={i}
                    aria-hidden
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      background: rgbCss(c),
                      height: boardCellSize,
                      width: boardCellSize,
                    }}
                  />
                );
              })}
            </div>

            {/* floating tiles reveal */}
            {tilePresentations.map(({ tile, stackIndex, offsetX, offsetY }, idx) => {
              const left = tile.x * boardPitch;
              const top = tile.y * boardPitch;
              const w = boardCellSize * 2 + boardGap;
              const h = boardCellSize * 2 + boardGap;
              const delay = prefersReducedMotion ? 0 : 0.62 + idx * 0.13;

              return (
                <motion.div
                  key={`tile-${tile.hue}-${tile.x}-${tile.y}-${runId}`}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    width: w,
                    height: h,
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: `hsla(${tile.hue}, ${DEFAULT_S}%, ${DEFAULT_L}%, ${alpha})`,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.14)',
                    zIndex: 10 + stackIndex,
                  }}
                  initial={{ opacity: 0, x: offsetX, y: offsetY, scale: 0.985 }}
                  animate={
                    phase === 'reveal'
                      ? { opacity: 1, x: offsetX, y: offsetY - 12, scale: 1 }
                      : phase === 'glow'
                        ? { opacity: 0, x: offsetX, y: offsetY, scale: 0.985 }
                        : { opacity: 0, x: offsetX, y: offsetY, scale: 0.985 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.34,
                    ease: 'easeOut',
                    delay,
                  }}
                />
              );
            })}

            <AnimatePresence>
              {correct && phase === 'reveal' && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    stiffness: 520,
                    damping: 30,
                    delay: prefersReducedMotion ? 0 : 1.05,
                  }}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 10,
                    padding: '8px 10px',
                    borderRadius: 999,
                    color: 'white',
                    fontWeight: 800,
                    letterSpacing: 0.3,
                    background:
                      'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(99,102,241,0.95))',
                    boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
                  }}
                >
                  {t('pages.prismatrix.correctBonus')}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderBoard = ({
    board,
    overlays,
    label,
  }: {
    board: { r: number; g: number; b: number }[];
    overlays?: { hue: number; pos: TilePos }[];
    label: string;
  }) => {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="card" style={{ padding: 12 }}>
          <div
            role="grid"
            aria-label={label}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(4, ${boardCellSize}px)`,
              gridTemplateRows: `repeat(4, ${boardCellSize}px)`,
              gap: boardGap,
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: 16 }, (_, i) => {
              const x = i % 4;
              const y = Math.floor(i / 4);
              const c = board[i] ?? { r: 255, g: 255, b: 255 };
              const cellOverlays = overlays
                ? overlays.filter((o) => tileCoversCell(o.pos, x, y))
                : [];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={overlays ? undefined : undefined}
                  className="card"
                  style={{
                    padding: 0,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    cursor: overlays ? 'default' : 'default',
                    background: `rgb(${c.r}, ${c.g}, ${c.b})`,
                    position: 'relative',
                    height: boardCellSize,
                    width: boardCellSize,
                  }}
                  aria-label={`${label} (${x},${y})`}
                >
                  {cellOverlays.map((o) => (
                    <div
                      key={`${o.hue}|${o.pos.x},${o.pos.y}|${i}`}
                      aria-hidden
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `hsla(${o.hue}, ${DEFAULT_S}%, ${DEFAULT_L}%, ${DEFAULT_ALPHA})`,
                      }}
                    />
                  ))}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const answerOverlays = useMemo(() => {
    const out: { hue: number; pos: TilePos }[] = [];
    for (const [hue, pos] of placed.entries()) out.push({ hue, pos });
    return out;
  }, [placed]);

  return (
    <div className="container animate-fade-in" style={{ display: 'grid', gap: 16 }}>
      <PageTitle title={t('pages.prismatrix.title')} />
      <Description>{t('pages.prismatrix.desc')}</Description>

      <section style={{ display: 'grid', gap: 16 }}>
        {!puzzle && <p>{t('pages.prismatrix.loading')}</p>}

        {puzzle && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <h3 style={{ margin: 0 }}>{t('pages.prismatrix.sections.puzzle')}</h3>
                {renderBoard({
                  board: puzzle.board,
                  label: t('pages.prismatrix.aria.puzzleBoard'),
                })}
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0 }}>{t('pages.prismatrix.sections.place')}</h3>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {t('pages.prismatrix.hints.topLeftOnly')}
                  </span>
                </div>

                <div className="card" style={{ padding: 12 }}>
                  <div
                    aria-label={t('pages.prismatrix.aria.answerBoard')}
                    style={{
                      position: 'relative',
                      width: boardPitch * 4 - boardGap,
                      height: boardPitch * 4 - boardGap,
                      marginInline: 'auto',
                    }}
                  >
                    <div
                      role="grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(4, ${boardCellSize}px)`,
                        gridTemplateRows: `repeat(4, ${boardCellSize}px)`,
                        gap: boardGap,
                        justifyContent: 'center',
                      }}
                    >
                      {Array.from({ length: 16 }, (_, i) => {
                        const x = i % 4;
                        const y = Math.floor(i / 4);
                        const overlays = answerOverlays.filter((o) => tileCoversCell(o.pos, x, y));
                        return (
                          <div
                            key={i}
                            className="card"
                            style={{
                              padding: 0,
                              borderRadius: 10,
                              overflow: 'hidden',
                              border: '1px solid var(--color-border)',
                              background: 'white',
                              position: 'relative',
                              height: boardCellSize,
                              width: boardCellSize,
                            }}
                            aria-label={`${t('pages.prismatrix.aria.answerCell')} (${x},${y})`}
                          >
                            {overlays.map((o) => (
                              <div
                                key={`${o.hue}|${o.pos.x},${o.pos.y}|${i}`}
                                aria-hidden
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: `hsla(${o.hue}, ${DEFAULT_S}%, ${DEFAULT_L}%, ${DEFAULT_ALPHA})`,
                                }}
                              />
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    {/* 3×3 click points between 4 cells (top-left placements) */}
                    {Array.from({ length: 9 }, (_, i) => {
                      const x = i % 3;
                      const y = Math.floor(i / 3);
                      const left = x * boardPitch + boardCellSize + boardGap / 2;
                      const top = y * boardPitch + boardCellSize + boardGap / 2;
                      return (
                        <button
                          key={`gap-${i}`}
                          type="button"
                          onClick={() => placeActiveAt(x, y)}
                          className="btn"
                          style={{
                            position: 'absolute',
                            left,
                            top,
                            transform: 'translate(-50%, -50%)',
                            width: 22,
                            height: 22,
                            padding: 0,
                            borderRadius: 999,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-surface)',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                          }}
                          aria-label={t('pages.prismatrix.aria.placeAt', { x, y })}
                          title={t('pages.prismatrix.aria.placeAt', { x, y })}
                        >
                          <span className="sr-only">
                            {t('pages.prismatrix.aria.placeAt', { x, y })}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                            <path
                              d="M12 5v14M5 12h14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div className="card" style={{ display: 'grid', gap: 12 }}>
                <h3 style={{ margin: 0 }}>{t('pages.prismatrix.sections.answer')}</h3>

                <div style={{ display: 'grid', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {HUES.map((hue) => {
                      const isSelected = selected.includes(hue);
                      const isActive = activeHue === hue;
                      return (
                        <button
                          key={hue}
                          type="button"
                          onClick={() => toggleSelectHue(hue)}
                          className="btn"
                          style={{
                            padding: 0,
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            border: isActive
                              ? '3px solid var(--color-primary)'
                              : isSelected
                                ? '2px solid var(--color-text-primary)'
                                : '1px solid var(--color-border)',
                            background: `hsla(${hue}, ${DEFAULT_S}%, ${DEFAULT_L}%, ${DEFAULT_ALPHA})`,
                            boxShadow: isSelected ? 'var(--shadow-sm)' : undefined,
                          }}
                          aria-pressed={isSelected}
                          aria-label={t('pages.prismatrix.aria.hueButton', { hue: hueLabel(hue) })}
                          title={hueLabel(hue)}
                        />
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {t('pages.prismatrix.labels.selectedCount', { count: placed.size })}
                    </span>
                    {activeHue !== null && (
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {t('pages.prismatrix.labels.active', { hue: hueLabel(activeHue) })}
                      </span>
                    )}
                    <div className="prismatrix-actions">
                      <button className="btn" type="button" onClick={onResetAnswer}>
                        {t('pages.prismatrix.buttons.resetAnswer')}
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={onCheck}
                        disabled={!guessValid}
                      >
                        {t('pages.prismatrix.buttons.check')}
                      </button>
                      <button className="btn" type="button" onClick={onNewPuzzle}>
                        {t('pages.prismatrix.buttons.newPuzzle')}
                      </button>
                    </div>
                  </div>

                  {message && (
                    <div role="status" className="card" style={{ padding: 12 }}>
                      <p style={{ margin: 0 }}>{message}</p>
                    </div>
                  )}

                  {feedback && (
                    <div
                      className="card"
                      role="status"
                      style={{
                        padding: 12,
                        border: feedback.complete
                          ? '2px solid var(--color-success)'
                          : '1px solid var(--color-border)',
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        {t('pages.prismatrix.feedback', {
                          exact: feedback.exact,
                          hueOnly: feedback.hueOnly,
                        })}
                      </p>
                      {feedback.complete && (
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-success)' }}>
                          {t('pages.prismatrix.feedbackComplete')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                  <button
                    className="btn"
                    type="button"
                    onClick={() =>
                      setShowSolution((v) => {
                        const next = !v;
                        if (next) setSolutionRunId((id) => id + 1);
                        return next;
                      })
                    }
                  >
                    {showSolution
                      ? t('pages.prismatrix.buttons.hideSolution')
                      : t('pages.prismatrix.buttons.showSolution')}
                  </button>
                  {showSolution && (
                    <div style={{ display: 'grid', gap: 12 }}>
                      <SolutionDecomposeBoard
                        puzzle={puzzle}
                        correct={Boolean(feedback?.complete)}
                        runId={solutionRunId}
                      />
                      <div className="card" style={{ padding: 12 }}>
                        <ul style={{ display: 'grid', gap: 6, margin: 0, paddingLeft: 18 }}>
                          {puzzle.tiles
                            .slice()
                            .sort((a, b) => a.hue - b.hue)
                            .map((tile) => {
                              const col = tile.x + 1;
                              const row = tile.y + 1;
                              return (
                                <li
                                  key={tile.hue}
                                  style={{
                                    color: 'var(--color-text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                  }}
                                >
                                  <span
                                    aria-hidden
                                    style={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: 999,
                                      border: '1px solid var(--color-border)',
                                      background: `hsla(${tile.hue}, ${DEFAULT_S}%, ${DEFAULT_L}%, 0.95)`,
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                                      flex: '0 0 auto',
                                    }}
                                  />
                                  <span
                                    style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}
                                  >
                                    {hueLabel(tile.hue)}
                                  </span>
                                  <span>
                                    {t('pages.prismatrix.solutionItem', {
                                      x: tile.x,
                                      y: tile.y,
                                      col,
                                      row,
                                    })}
                                  </span>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <HomeLink fixed />
    </div>
  );
}
