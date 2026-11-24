import { ColorDepth, type DepthComparison, type DepthTendency } from '../domain/color-depth';
import { type Hsl } from './color';

export type { DepthComparison, DepthTendency };

/** 進出色の山。赤橙付近。反対側（約 210°）が後退の山になる。 */
export const CLASSIC_ADVANCING_HSL: Hsl = { h: 8, s: 88, l: 50 };
export const CLASSIC_RECEDING_HSL: Hsl = { h: 222, s: 88, l: 50 };

export function hueWarmth(hue: number): number {
  return ColorDepth.warmth(hue);
}

export function advanceScore(hsl: Hsl): number {
  return ColorDepth.score(hsl);
}

export function depthTendency(hsl: Hsl): DepthTendency {
  return ColorDepth.tendency(hsl);
}

export function compareDepth(left: Hsl, right: Hsl): DepthComparison {
  return ColorDepth.compare(left, right);
}
