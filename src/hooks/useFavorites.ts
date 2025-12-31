import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { Hex } from '../lib/color';
import { favoritesStore } from '../lib/favorites';

function getSnapshotKey(): string {
  const list = favoritesStore.getAll();
  return list.slice().sort().join(',');
}

export function useFavorites() {
  const key = useSyncExternalStore(
    favoritesStore.subscribe.bind(favoritesStore),
    getSnapshotKey,
    getSnapshotKey,
  );

  const set = useMemo(() => {
    if (!key) return new Set<string>();
    return new Set(key.split(',').filter(Boolean));
  }, [key]);

  const has = useCallback((hex: Hex) => favoritesStore.has(hex), []);
  const add = useCallback((hex: Hex) => favoritesStore.add(hex), []);
  const remove = useCallback((hex: Hex) => favoritesStore.remove(hex), []);
  const toggle = useCallback((hex: Hex) => favoritesStore.toggle(hex), []);

  return { set, has, add, remove, toggle };
}
