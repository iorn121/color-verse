import type { Hex, Rgb } from '../lib/color';
import { hexToRgb, rgbToHex } from '../lib/color';
import {
  contrastRatio,
  type ContrastResult,
  ContrastResultSchema,
  WCAG_AA_NORMAL,
  WCAG_AAA_NORMAL,
} from '../lib/contrast';

/** 画面に置く1色。別の色とのコントラスト判定を自分で持つ。 */
export class Swatch {
  private constructor(
    readonly hex: Hex,
    readonly rgb: Rgb,
  ) {}

  static parse(input: string): Swatch | null {
    const rgb = hexToRgb(input);
    if (!rgb) return null;
    return new Swatch(rgbToHex(rgb), rgb);
  }

  contrastWith(background: Swatch): ContrastResult {
    const ratio = contrastRatio(this.rgb, background.rgb);
    const aaMet = ratio >= WCAG_AA_NORMAL;
    const aaaMet = ratio >= WCAG_AAA_NORMAL;
    const level = !aaMet ? 'aa_fail' : aaaMet ? 'aaa_pass' : 'aa_pass_aaa_fail';
    return ContrastResultSchema.parse({
      ratio,
      foreground: this.hex,
      background: background.hex,
      aaMet,
      aaaMet,
      level,
    });
  }
}
