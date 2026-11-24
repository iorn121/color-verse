import { clamp, type Hsl } from '../lib/color';

const ADVANCING_HUE = 30;
const TENDENCY_THRESHOLD = 0.12;
const COMPARISON_THRESHOLD = 0.08;

export type DepthTendency = 'advancing' | 'receding' | 'neutral';
export type DepthComparison = 'left' | 'right' | 'similar';

/** 色が手前に見えるか奥に見えるか。 */
export class ColorDepth {
  static warmth(hue: number): number {
    const radians = ((hue - ADVANCING_HUE) * Math.PI) / 180;
    return Math.cos(radians);
  }

  static score(hsl: Hsl): number {
    const chroma = clamp(hsl.s, 0, 100) / 100;
    const lightnessWeight = 1 - Math.abs(clamp(hsl.l, 0, 100) - 50) / 50;
    return ColorDepth.warmth(hsl.h) * chroma * lightnessWeight;
  }

  static tendency(hsl: Hsl): DepthTendency {
    const value = ColorDepth.score(hsl);
    if (value > TENDENCY_THRESHOLD) return 'advancing';
    if (value < -TENDENCY_THRESHOLD) return 'receding';
    return 'neutral';
  }

  static compare(left: Hsl, right: Hsl): DepthComparison {
    const delta = ColorDepth.score(left) - ColorDepth.score(right);
    if (Math.abs(delta) < COMPARISON_THRESHOLD) return 'similar';
    return delta > 0 ? 'left' : 'right';
  }
}
