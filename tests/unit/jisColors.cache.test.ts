import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearCachedJisColors, JisColorModel } from '../../src/lib/jisColors';

const CSV = [
  'カラーコード,慣用色名,読み,マンセル値,系統色名,H,S,B,分類',
  '#F9A1D0,鴇色,ときいろ,7RP 7.5/8,明るい紫みの赤,328,35,98,和色名',
].join('\n');

describe('JisColorModel.loadAll', () => {
  afterEach(() => {
    clearCachedJisColors();
    vi.unstubAllGlobals();
  });

  it('fetches and parses the CSV once for repeated calls', async () => {
    const fetchMock = vi.fn(async () => new Response(CSV, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const [first, second] = await Promise.all([JisColorModel.loadAll(), JisColorModel.loadAll()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
    expect(first[0]?.name).toBe('鴇色');
  });

  it('loads again after a failed fetch', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockResolvedValueOnce(new Response(CSV, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(JisColorModel.loadAll()).rejects.toThrow(/500/);
    const colors = await JisColorModel.loadAll();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(colors).toHaveLength(1);
  });
});
