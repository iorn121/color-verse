import { z } from 'zod';

import { Swatch } from '../domain/swatch';
import type { Hex, Rgb } from './color';

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AAA_NORMAL = 7;

export const ContrastLevelSchema = z.enum(['aa_fail', 'aa_pass_aaa_fail', 'aaa_pass']);

export const ContrastResultSchema = z.object({
  ratio: z.number(),
  foreground: z.string().regex(/^#[0-9A-F]{6}$/),
  background: z.string().regex(/^#[0-9A-F]{6}$/),
  aaMet: z.boolean(),
  aaaMet: z.boolean(),
  level: ContrastLevelSchema,
});

export type ContrastResult = z.infer<typeof ContrastResultSchema>;

function channelToLinear(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  const rLin = channelToLinear(r);
  const gLin = channelToLinear(g);
  const bLin = channelToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/** WCAG 2.1 contrast ratio for foreground on background (order-independent). */
export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const lFg = relativeLuminance(foreground);
  const lBg = relativeLuminance(background);
  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  return (lighter + 0.05) / (darker + 0.05);
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function evaluateContrast(foregroundHex: Hex, backgroundHex: Hex): ContrastResult | null {
  const foreground = Swatch.parse(foregroundHex);
  const background = Swatch.parse(backgroundHex);
  if (!foreground || !background) return null;
  return foreground.contrastWith(background);
}
