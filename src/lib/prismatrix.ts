import { hslToRgb } from './color';

export const HUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const;

export const DEFAULT_S = 70;
export const DEFAULT_L = 60;
export const DEFAULT_ALPHA = 0.3;

export type TilePos = { x: 0 | 1 | 2; y: 0 | 1 | 2 };
export type Tile = TilePos & { hue: (typeof HUES)[number] };
export type Rgb255 = { r: number; g: number; b: number };

export type Puzzle = {
  tiles: Tile[];
  board: Rgb255[]; // length 16 (row-major)
  hash: string;
};

type FilterCoeff01 = { r: number; g: number; b: number };

const POSITIONS: TilePos[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];

function clamp255(n: number): number {
  return Math.min(255, Math.max(0, Math.round(n)));
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tileCellIndices(pos: TilePos): number[] {
  const out: number[] = [];
  for (let dy = 0 as 0 | 1; dy <= 1; dy++) {
    for (let dx = 0 as 0 | 1; dx <= 1; dx++) {
      const x = pos.x + dx;
      const y = pos.y + dy;
      out.push(y * 4 + x);
    }
  }
  return out;
}

export function computeOverlapCounts(tiles: Tile[]): number[] {
  const counts = Array.from({ length: 16 }, () => 0);
  for (const t of tiles) {
    for (const idx of tileCellIndices(t)) counts[idx] += 1;
  }
  return counts;
}

function filterCoeffForHue(hue: (typeof HUES)[number], alpha: number): FilterCoeff01 {
  const rgb = hslToRgb({ h: hue, s: DEFAULT_S, l: DEFAULT_L });
  const r = 1 - alpha + alpha * (rgb.r / 255);
  const g = 1 - alpha + alpha * (rgb.g / 255);
  const b = 1 - alpha + alpha * (rgb.b / 255);
  return { r, g, b };
}

export function computeBoard(
  tiles: Tile[],
  { alpha = DEFAULT_ALPHA }: { alpha?: number } = {},
): Rgb255[] {
  const mul: FilterCoeff01[] = Array.from({ length: 16 }, () => ({ r: 1, g: 1, b: 1 }));
  for (const t of tiles) {
    const coeff = filterCoeffForHue(t.hue, alpha);
    for (const idx of tileCellIndices(t)) {
      mul[idx] = {
        r: mul[idx].r * coeff.r,
        g: mul[idx].g * coeff.g,
        b: mul[idx].b * coeff.b,
      };
    }
  }
  return mul.map((m) => ({
    r: clamp255(m.r * 255),
    g: clamp255(m.g * 255),
    b: clamp255(m.b * 255),
  }));
}

export function boardHash(board: Rgb255[]): string {
  // Stable string representation for equality checks.
  return board.map((c) => `${c.r},${c.g},${c.b}`).join('|');
}

export function isPlacementValid(tiles: Tile[], maxOverlap: number): boolean {
  return computeOverlapCounts(tiles).every((c) => c <= maxOverlap);
}

function generateCandidatePuzzle({
  maxOverlap,
  requireOverlap,
  alpha,
  maxAttempts,
}: {
  maxOverlap: number;
  requireOverlap: boolean;
  alpha: number;
  maxAttempts: number;
}): Puzzle | null {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const hues = shuffleInPlace([...HUES]).slice(0, 6) as (typeof HUES)[number][];
    const counts = Array.from({ length: 16 }, () => 0);
    const tiles: Tile[] = [];
    let failed = false;

    for (const hue of hues) {
      const candidates = shuffleInPlace(POSITIONS.map((p) => ({ ...p })));
      let placed: Tile | null = null;
      for (const pos of candidates) {
        const indices = tileCellIndices(pos);
        if (indices.some((idx) => counts[idx] + 1 > maxOverlap)) continue;
        for (const idx of indices) counts[idx] += 1;
        placed = { hue, x: pos.x, y: pos.y };
        break;
      }
      if (!placed) {
        failed = true;
        break;
      }
      tiles.push(placed);
    }

    if (failed) continue;
    if (requireOverlap && !counts.some((c) => c >= 2)) continue;

    const board = computeBoard(tiles, { alpha });
    const hash = boardHash(board);
    return { tiles, board, hash };
  }
  return null;
}

export function isLikelyUnique(
  targetHash: string,
  {
    trials = 500,
    maxOverlap = 3,
    requireOverlap = true,
    alpha = DEFAULT_ALPHA,
  }: {
    trials?: number;
    maxOverlap?: number;
    requireOverlap?: boolean;
    alpha?: number;
  } = {},
): boolean {
  for (let i = 0; i < trials; i++) {
    const other = generateCandidatePuzzle({
      maxOverlap,
      requireOverlap,
      alpha,
      maxAttempts: 40,
    });
    if (!other) continue;
    if (other.hash === targetHash) return false;
  }
  return true;
}

export function generatePuzzle({
  maxOverlap = 3,
  requireOverlap = true,
  uniquenessTrials = 500,
  alpha = DEFAULT_ALPHA,
  maxAttempts = 200,
}: {
  maxOverlap?: number;
  requireOverlap?: boolean;
  uniquenessTrials?: number;
  alpha?: number;
  maxAttempts?: number;
} = {}): Puzzle {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateCandidatePuzzle({
      maxOverlap,
      requireOverlap,
      alpha,
      maxAttempts: 80,
    });
    if (!candidate) continue;
    if (uniquenessTrials > 0) {
      if (
        !isLikelyUnique(candidate.hash, {
          trials: uniquenessTrials,
          maxOverlap,
          requireOverlap,
          alpha,
        })
      ) {
        continue;
      }
    }
    return candidate;
  }
  throw new Error('Failed to generate puzzle within attempt limit');
}
