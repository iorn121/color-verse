import { describe, expect, it } from 'vitest';

import { ColorQuizRound } from '../../src/domain/color-quiz';
import type { JisColor } from '../../src/lib/jisColors';

const colors: JisColor[] = [
  { name: '赤', hex: '#FF0000', group: '和色名' },
  { name: '青', hex: '#0000FF', group: '和色名' },
  { name: '黄', hex: '#FFFF00', group: '和色名' },
  { name: '緑', hex: '#00FF00', group: '和色名' },
];

describe('ColorQuizRound', () => {
  it('deals four unique choices and grades only the correct pair', () => {
    const round = ColorQuizRound.deal(colors, 'name-to-color', { int: () => 0 });
    expect(round).not.toBeNull();
    const options = round!.question.options;
    expect(new Set(options.map((color) => color.name)).size).toBe(4);
    expect(round!.grade(round!.question.correct.hex, round!.question.correct.name)).toBe(true);
    expect(round!.grade('#000000', '黒')).toBe(false);
  });

  it('refuses to deal when there are fewer than four colors', () => {
    expect(ColorQuizRound.deal(colors.slice(0, 3), 'color-to-name', { int: () => 0 })).toBeNull();
  });
});
