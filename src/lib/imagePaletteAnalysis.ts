import { colord } from 'colord';
import { z } from 'zod';

import type { Rgb } from './color';

export const MAX_ANALYSIS_DIMENSION = 200;
const MIN_ALPHA = 128;
const K_MEANS_ITERATIONS = 24;
const CLUSTER_COUNT = 10;
const SATURATION_WEIGHT = 0.55;
const DOMINANT_LIMIT = 5;

export const DominantColorSchema = z.object({
  hex: z.string().regex(/^#[0-9A-F]{6}$/),
  rgb: z.tuple([z.number().int(), z.number().int(), z.number().int()]),
  hsl: z.tuple([z.number(), z.number(), z.number()]),
  population: z.number(),
  type: z.enum(['vibrant', 'muted', 'light', 'dark']),
});

export type DominantColor = z.infer<typeof DominantColorSchema>;

export const PaletteAnalysisOutputSchema = z.object({
  dominant_colors: z.array(DominantColorSchema),
  average_color: z.string().regex(/^#[0-9A-F]{6}$/),
});

export type PaletteAnalysisOutput = z.infer<typeof PaletteAnalysisOutputSchema>;

export type PaletteAnalysisWithBackground = PaletteAnalysisOutput & {
  background_colors: DominantColor[];
};

function distanceSquared(a: Rgb, b: Rgb): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function pickInitialCentroids(pixels: Rgb[], k: number): Rgb[] {
  const centroids: Rgb[] = [];
  const n = pixels.length;
  for (let i = 0; i < k; i++) {
    const idx = Math.floor(((i + 0.5) * n) / k) % n;
    centroids.push({ ...pixels[idx] });
  }
  return centroids;
}

function kMeans(pixels: Rgb[], k: number): { centroids: Rgb[]; counts: number[] } {
  if (pixels.length === 0) {
    return { centroids: [], counts: [] };
  }
  const kk = Math.min(k, pixels.length);
  let centroids = pickInitialCentroids(pixels, kk);
  const assignments = new Array<number>(pixels.length).fill(0);

  for (let iter = 0; iter < K_MEANS_ITERATIONS; iter++) {
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let j = 0; j < kk; j++) {
        const d = distanceSquared(pixels[i], centroids[j]);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }

    const sums = Array.from({ length: kk }, () => ({ r: 0, g: 0, b: 0, n: 0 }));
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      const p = pixels[i];
      sums[c].r += p.r;
      sums[c].g += p.g;
      sums[c].b += p.b;
      sums[c].n += 1;
    }

    const next: Rgb[] = [];
    for (let j = 0; j < kk; j++) {
      if (sums[j].n === 0) {
        next[j] = { ...centroids[j] };
        continue;
      }
      next[j] = {
        r: Math.round(sums[j].r / sums[j].n),
        g: Math.round(sums[j].g / sums[j].n),
        b: Math.round(sums[j].b / sums[j].n),
      };
    }
    centroids = next;
    if (!changed && iter > 2) break;
  }

  const counts = new Array(kk).fill(0);
  for (const a of assignments) counts[a]++;

  return { centroids, counts };
}

function averageRgb(pixels: Rgb[]): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const p of pixels) {
    r += p.r;
    g += p.g;
    b += p.b;
  }
  const n = pixels.length;
  return {
    r: Math.round(r / n),
    g: Math.round(g / n),
    b: Math.round(b / n),
  };
}

function isBackgroundCluster(rgb: Rgb, population: number): boolean {
  if (population >= 0.8) return true;
  const hsl = colord(rgb).toHsl();
  const l = hsl.l;
  const s = hsl.s;
  if (l >= 96 && s <= 12) return true;
  if (rgb.r >= 248 && rgb.g >= 248 && rgb.b >= 248) return true;
  if (l <= 4) return true;
  if (rgb.r <= 12 && rgb.g <= 12 && rgb.b <= 12) return true;
  return false;
}

function classifyType(h: number, s: number, l: number): DominantColor['type'] {
  if (l >= 78) return 'light';
  if (l <= 22) return 'dark';
  if (s < 22) return 'muted';
  return 'vibrant';
}

function toDominantColor(rgb: Rgb, population: number): DominantColor {
  const c = colord(rgb);
  const hex = c.toHex().toUpperCase();
  const hslObj = c.toHsl();
  const h = Number.isFinite(hslObj.h) ? hslObj.h : 0;
  const hsl: [number, number, number] = [
    Math.round(h),
    Math.round(hslObj.s),
    Math.round(hslObj.l),
  ];
  return {
    hex,
    rgb: [rgb.r, rgb.g, rgb.b],
    hsl,
    population: Math.round(population * 1000) / 1000,
    type: classifyType(h, hslObj.s, hslObj.l),
  };
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_LOAD_FAILED'));
    };
    img.src = url;
  });
}

export function getResizedRgbPixels(img: HTMLImageElement): Rgb[] {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (w === 0 || h === 0) return [];

  const scale = Math.min(1, MAX_ANALYSIS_DIMENSION / Math.max(w, h));
  const tw = Math.max(1, Math.round(w * scale));
  const th = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, tw, th);
  const data = ctx.getImageData(0, 0, tw, th).data;
  const pixels: Rgb[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < MIN_ALPHA) continue;
    pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }

  return pixels;
}

/** DOM 上で実行。画像を縮小 → K-Means → 背景除去・彩度ウェイトで上位色を返す */
export function analyzeImagePixels(pixels: Rgb[]): PaletteAnalysisWithBackground {
  if (pixels.length === 0) {
    throw new Error('NO_OPAQUE_PIXELS');
  }

  const avgRgb = averageRgb(pixels);
  const average_color = colord(avgRgb).toHex().toUpperCase();

  const k = Math.min(CLUSTER_COUNT, pixels.length);
  const { centroids, counts } = kMeans(pixels, k);
  const total = pixels.length;

  type Cluster = { rgb: Rgb; population: number; count: number };
  const clusters: Cluster[] = [];

  for (let i = 0; i < centroids.length; i++) {
    const count = counts[i];
    if (count === 0) continue;
    clusters.push({
      rgb: centroids[i],
      population: count / total,
      count,
    });
  }

  const background_colors: DominantColor[] = [];
  const foreground: Cluster[] = [];

  for (const cl of clusters) {
    if (isBackgroundCluster(cl.rgb, cl.population)) {
      background_colors.push(toDominantColor(cl.rgb, cl.population));
    } else {
      foreground.push(cl);
    }
  }

  foreground.sort((a, b) => {
    const sa = colord(a.rgb).toHsl().s;
    const sb = colord(b.rgb).toHsl().s;
    const wa = a.population * (1 + SATURATION_WEIGHT * (sa / 100));
    const wb = b.population * (1 + SATURATION_WEIGHT * (sb / 100));
    return wb - wa;
  });

  const dominant_colors = foreground.slice(0, DOMINANT_LIMIT).map((cl) => toDominantColor(cl.rgb, cl.population));

  const output: PaletteAnalysisWithBackground = {
    dominant_colors,
    average_color,
    background_colors,
  };

  PaletteAnalysisOutputSchema.parse({
    dominant_colors,
    average_color,
  });

  return output;
}

export async function analyzeImageFile(file: File): Promise<PaletteAnalysisWithBackground> {
  const img = await loadImageFromFile(file);
  const pixels = getResizedRgbPixels(img);
  return analyzeImagePixels(pixels);
}
