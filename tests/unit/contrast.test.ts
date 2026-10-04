import { describe, expect, it } from 'vitest';

import { evaluateContrast } from '../../src/lib/contrast';

describe('evaluateContrast', () => {
  it('treats black on white as AAA', () => {
    const result = evaluateContrast('#000000', '#FFFFFF');
    expect(result).not.toBeNull();
    expect(result?.ratio).toBeCloseTo(21, 2);
    expect(result?.aaMet).toBe(true);
    expect(result?.aaaMet).toBe(true);
    expect(result?.level).toBe('aaa_pass');
  });

  it('keeps the same ratio when the colors are swapped', () => {
    const forward = evaluateContrast('#000000', '#FFFFFF');
    const backward = evaluateContrast('#FFFFFF', '#000000');
    expect(backward?.ratio).toBeCloseTo(forward?.ratio ?? 0, 5);
    expect(backward?.level).toBe(forward?.level);
  });

  it('marks #777777 on white as an AA failure', () => {
    const result = evaluateContrast('#777777', '#FFFFFF');
    expect(result?.aaMet).toBe(false);
    expect(result?.level).toBe('aa_fail');
  });

  it('marks a mid gray on white as AA only', () => {
    const result = evaluateContrast('#767676', '#FFFFFF');
    expect(result?.aaMet).toBe(true);
    expect(result?.aaaMet).toBe(false);
    expect(result?.level).toBe('aa_pass_aaa_fail');
  });

  it('returns null for an invalid hex', () => {
    expect(evaluateContrast('#GGG', '#FFFFFF')).toBeNull();
    expect(evaluateContrast('', '#FFFFFF')).toBeNull();
  });
});
