import { clamp, type Hsl } from './color';

/** 進出色の山。赤橙付近。反対側（約 210°）が後退の山になる。 */
const ADVANCING_HUE = 30;

const TENDENCY_THRESHOLD = 0.12;
const COMPARISON_THRESHOLD = 0.08;

export const CLASSIC_ADVANCING_HSL: Hsl = { h: 8, s: 88, l: 50 };
export const CLASSIC_RECEDING_HSL: Hsl = { h: 222, s: 88, l: 50 };

export type DepthTendency = 'advancing' | 'receding' | 'neutral';
export type DepthComparison = 'left' | 'right' | 'similar';

/** 色相の暖寒。+1 が進出側、−1 が後退側。 */
export function hueWarmth(hue: number): number {
  const radians = ((hue - ADVANCING_HUE) * Math.PI) / 180;
  return Math.cos(radians);
}

/**
 * 手前に見えやすさの目安。正が進出色、負が後退色。
 * 彩度が高いほど強く、明度が 50% から離れるほど弱くなる。
 */
export function advanceScore(hsl: Hsl): number {
  const chroma = clamp(hsl.s, 0, 100) / 100;
  const lightnessWeight = 1 - Math.abs(clamp(hsl.l, 0, 100) - 50) / 50;
  return hueWarmth(hsl.h) * chroma * lightnessWeight;
}

export function depthTendency(hsl: Hsl): DepthTendency {
  const score = advanceScore(hsl);
  if (score > TENDENCY_THRESHOLD) return 'advancing';
  if (score < -TENDENCY_THRESHOLD) return 'receding';
  return 'neutral';
}

export function compareDepth(left: Hsl, right: Hsl): DepthComparison {
  const delta = advanceScore(left) - advanceScore(right);
  if (Math.abs(delta) < COMPARISON_THRESHOLD) return 'similar';
  return delta > 0 ? 'left' : 'right';
}
