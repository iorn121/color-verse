# 色彩分析（画像カラーパレット）

## 概要

アップロード画像をブラウザ内で縮小・クラスタリングし、支配色パレットと平均色を表示する。

## データフロー

1. `input[type=file]` で画像を受け取る。
2. 非表示 Canvas で長辺最大 **200px** に等比リサイズし、`getImageData()` で RGBA を取得。
3. **K-Means**（RGB 空間）でクラスタ代表色と占有率を算出。
4. **フィルタ**: 白・黒に近い色、または占有率 **≥80%** を背景として扱い、メインパレットとは別扱い（または除外）。
5. **ソート**: 占有率 × 彩度ウェイトで並べ、上位 **5** 色を支配色として表示。
6. **平均色**: 全有効ピクセルの RGB 平均を HEX で出力。

## 出力スキーマ（JSON）

`dominant_colors[].hex` / `rgb` / `hsl`（度数・0–100） / `population` / `type`（`vibrant` | `muted` | `light` | `dark`）、`average_color`。

表示・将来連携用に **colord** で HSL および OKLCH（内部計算可）を扱う。

## UI

- 解析中は **Lucide React** のローディングアイコン。
- カラーチップクリックで HEX をクリップボードへコピー。
- 文言は i18n（`common`）。

## 境界

- **触らない**: PWA / `vite.config.ts` の manifest（本機能では変更なし）。
- **色トークン**: UI は既存の `var(--color-*)` を使用。アルゴリズム中間値の RGB は例外。

## 関連コード

- `src/lib/imagePaletteAnalysis.ts` — 解析ロジック・Zod スキーマ
- `src/pages/ColorAnalysisPage.tsx`
- `src/components/color/ImagePaletteAnalyzer.tsx`
