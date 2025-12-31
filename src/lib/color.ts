export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };
export type Hex = string; // '#RRGGBB'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function hexToRgb(hex: Hex): Rgb | null {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }: Rgb): Hex {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r1:
        h = ((g1 - b1) / delta) % 6;
        break;
      case g1:
        h = (b1 - r1) / delta + 2;
        break;
      default:
        h = (r1 - g1) / delta + 4;
    }
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return {
    h: Math.round((h * 60 + 360) % 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const s1 = clamp(s, 0, 100) / 100;
  const l1 = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (h < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (h < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (h < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (h < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (h < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function formatRgb(value: Rgb | null, invalidLabel = 'invalid'): string {
  if (!value) return invalidLabel;
  return `rgb(${value.r}, ${value.g}, ${value.b})`;
}

export function formatHsl(value: Hsl | null, invalidLabel = 'invalid'): string {
  if (!value) return invalidLabel;
  return `hsl(${value.h}, ${value.s}%, ${value.l}%)`;
}
