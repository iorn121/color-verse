import { describe, expect, it } from 'vitest';

import { Swatch } from '../../src/domain/swatch';

describe('Swatch', () => {
  it('normalizes a short hex and rejects a broken one', () => {
    expect(Swatch.parse('#fff')?.hex).toBe('#FFFFFF');
    expect(Swatch.parse('nope')).toBeNull();
  });

  it('owns the contrast decision against another swatch', () => {
    const ink = Swatch.parse('#000000');
    const paper = Swatch.parse('#FFFFFF');
    const result = ink?.contrastWith(paper!);
    expect(result?.level).toBe('aaa_pass');
    expect(result?.foreground).toBe('#000000');
    expect(result?.background).toBe('#FFFFFF');
  });
});
