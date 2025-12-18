export interface JisColor {
  readonly name: string;
  readonly reading?: string; // 慣用色名の読み
  readonly hex: string; // #RRGGBB
  readonly group: string; // 和色名 / 外来色名 など
  readonly munsell?: string; // マンセル値
  readonly systemName?: string; // 系統色名
  readonly h?: number;
  readonly s?: number;
  readonly b?: number;
}

/**
 * JIS慣用色データのモデル。
 * - CSVの読み込み/パース
 * - バリデーション/正規化
 * - 乱択ユーティリティ
 */
export const JisColorModel = {
  /**
   * サーバーからCSVを取得して配列に変換する。
   */
  async loadAll(signal?: AbortSignal): Promise<JisColor[]> {
    const res = await fetch(`${import.meta.env.BASE_URL}jis_colors.csv`, { signal });
    if (!res.ok) throw new Error(`Failed to load jis_colors.csv: ${res.status}`);
    const text = await res.text();
    return this.parseCsv(text);
  },

  /**
   * CSV全体テキストをパース。
   * フォーマット（更新後ヘッダー）:
   * カラーコード,慣用色名,読み,マンセル値,系統色名,H,S,B,分類
   */
  parseCsv(text: string): JisColor[] {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return [];

    const colors: JisColor[] = [];
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line) continue;
      const cols = this.parseCsvLine(line);
      const parsed = this.parseRow(cols);
      if (parsed) colors.push(parsed);
    }
    return colors;
  },

  /**
   * 1レコードをオブジェクトに変換。無効行はnull。
   */
  parseRow(cols: string[]): JisColor | null {
    if (!cols || cols.length < 9) return null;
    const hex = this.normalizeHex(cols[0]);
    const name = (cols[1] || '').trim();
    const reading = (cols[2] || '').trim() || undefined;
    const munsell = (cols[3] || '').trim() || undefined;
    const systemName = (cols[4] || '').trim() || undefined;
    const h = Number(cols[5]);
    const s = Number(cols[6]);
    const b = Number(cols[7]);
    const group = (cols[8] || '').trim(); // 分類（和色名 / 外来色名）

    if (!this.isValidHex(hex) || !name) return null;

    return {
      name,
      reading,
      hex,
      group,
      munsell,
      systemName,
      h: Number.isFinite(h) ? h : undefined,
      s: Number.isFinite(s) ? s : undefined,
      b: Number.isFinite(b) ? b : undefined,
    };
  },

  /**
   * ヘッダーを想定した単純CSVの1行スプリット。
   * ダブルクォートは使用しない前提。
   */
  parseCsvLine(line: string): string[] {
    return line.replace(/\r?$/, '').split(',');
  },

  normalizeHex(hex: string | undefined): string {
    return (hex || '').trim().toUpperCase();
  },

  isValidHex(hex: string): boolean {
    return /^#[0-9A-F]{6}$/.test(hex);
  },

  randomInt(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  },

  pickRandom<T>(arr: T[], count: number): T[] {
    const copy = arr.slice();
    const out: T[] = [];
    while (copy.length > 0 && out.length < count) {
      const idx = this.randomInt(copy.length);
      out.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return out;
  },

  /**
   * 安定した短いID（base36）を生成（hexとnameに依存）
   * - 同じ（hex,name）は常に同じID
   * - 異なる組み合わせは高確率で異なるID
   */
  makeId(color: Pick<JisColor, 'hex' | 'name'>): string {
    const key = `${color.hex}|${color.name}`;
    // djb2
    let hash = 5381;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash << 5) + hash + key.charCodeAt(i);
      hash |= 0; // 32-bit
    }
    return (hash >>> 0).toString(36);
  },
} as const;

// 既存呼び出し互換のための軽量ラッパー
export async function loadJisColors(signal?: AbortSignal): Promise<JisColor[]> {
  return JisColorModel.loadAll(signal);
}
export function getRandomInt(maxExclusive: number): number {
  return JisColorModel.randomInt(maxExclusive);
}
export function pickRandom<T>(arr: T[], count: number): T[] {
  return JisColorModel.pickRandom(arr, count);
}
