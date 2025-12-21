import { z } from 'zod';

const HEX_REGEX = /^#[0-9A-F]{6}$/;
const STORAGE_KEY = 'favorites.hex.v1';

const HexSchema = z
  .string()
  .transform((s: string) => s.trim().toUpperCase())
  .refine((s) => HEX_REGEX.test(s), { message: 'Invalid hex' });

const FavoritesSchema = z.array(HexSchema);

export interface FavoritesStore {
  getAll(): string[];
  has(hex: string): boolean;
  add(hex: string): void;
  remove(hex: string): void;
  toggle(hex: string): boolean;
  subscribe(listener: () => void): () => void;
}

function normalizeHex(hex: string): string {
  return (hex || '').trim().toUpperCase();
}

export class LocalFavoritesStore implements FavoritesStore {
  private listeners = new Set<() => void>();

  constructor(private storageKey = STORAGE_KEY) {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey) this.emit();
      });
    }
  }

  private read(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const safe = FavoritesSchema.safeParse(parsed);
      if (!safe.success) {
        // 不正データは読み取り時には破棄して空配列を返す（レンダー中にemitしない）
        return [];
      }
      return safe.data;
    } catch {
      return [];
    }
  }

  private write(list: string[]): void {
    const safe = FavoritesSchema.safeParse(list);
    const data = safe.success ? safe.data : [];
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore listener errors
      }
    });
  }

  getAll(): string[] {
    return this.read();
  }

  has(hex: string): boolean {
    const key = normalizeHex(hex);
    if (!HEX_REGEX.test(key)) return false;
    const list = this.read();
    return list.includes(key);
  }

  add(hex: string): void {
    const key = normalizeHex(hex);
    if (!HEX_REGEX.test(key)) return;
    const list = this.read();
    if (list.includes(key)) return;
    this.write([...list, key]);
  }

  remove(hex: string): void {
    const key = normalizeHex(hex);
    const next = this.read().filter((h) => h !== key);
    this.write(next);
  }

  toggle(hex: string): boolean {
    const key = normalizeHex(hex);
    if (!HEX_REGEX.test(key)) return false;
    const list = this.read();
    const exists = list.includes(key);
    if (exists) {
      this.write(list.filter((h) => h !== key));
      return false;
    }
    this.write([...list, key]);
    return true;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const favoritesStore: FavoritesStore = new LocalFavoritesStore();
