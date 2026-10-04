import { z } from 'zod';

import type { Hex, Rgb } from './color';
import { hexToRgb, rgbToHex } from './color';

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

function contrastLevel(ratio: number): z.infer<typeof ContrastLevelSchema> {
  if (ratio < WCAG_AA_NORMAL) return 'aa_fail';
  if (ratio < WCAG_AAA_NORMAL) return 'aa_pass_aaa_fail';
  return 'aaa_pass';
}

export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function evaluateContrast(foregroundHex: Hex, backgroundHex: Hex): ContrastResult | null {
  const fgRgb = hexToRgb(foregroundHex);
  const bgRgb = hexToRgb(backgroundHex);
  if (!fgRgb || !bgRgb) return null;

  const foreground = rgbToHex(fgRgb);
  const background = rgbToHex(bgRgb);
  const ratio = contrastRatio(fgRgb, bgRgb);
  const aaMet = ratio >= WCAG_AA_NORMAL;
  const aaaMet = ratio >= WCAG_AAA_NORMAL;

  return ContrastResultSchema.parse({
    ratio,
    foreground,
    background,
    aaMet,
    aaaMet,
    level: contrastLevel(ratio),
  });
}
