import { useMemo, useState } from 'react';

import type { JisColor } from '../lib/jisColors';
import { toHiragana } from '../lib/strings';

export type GroupFilter = 'all' | '和色名' | '外来色名';

export function useColorSearch(allColors: JisColor[]) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<GroupFilter>('all');

  const filtered = useMemo(() => {
    const list = Array.isArray(allColors) ? allColors : [];
    const q = query.trim();
    const qUpper = q.toUpperCase();
    const qHira = toHiragana(q);
    return list.filter((c) => {
      if (group !== 'all' && c.group !== group) return false;
      if (!q) return true;
      const nameHit = c.name.includes(q) || toHiragana(c.name).includes(qHira);
      const hexHit = c.hex.toUpperCase().includes(qUpper);
      const readingHit = c.reading ? toHiragana(c.reading).includes(qHira) : false;
      return nameHit || hexHit || readingHit;
    });
  }, [allColors, query, group]);

  const total = Array.isArray(allColors) ? allColors.length : 0;

  return {
    query,
    setQuery,
    group,
    setGroup,
    filtered,
    total,
  };
}
