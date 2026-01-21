### ColorVerse（カラーバース）

色の学習・ツール・分析・創作を一体化する PWA。Vite + React + TypeScript 構成で、ブラウザ内処理（Canvas/Web APIs）を中心に高速に動作します。

### 主な機能（現状）

- **カラーピッカー**: `HEX/RGB/HSL` の相互変換、数値入力・スライダー調整
- **変換ツール**: `Hex ⇄ RGB ⇄ HSL` の双方向変換 UI
- **画像の色調補正**: 明度/彩度/コントラスト調整（Canvas）
- **カラー辞典（JIS）**: `public/jis_colors.csv` を用いた色名・コード参照
- **お気に入り**: 色やパレットの保存（ローカル）
- **クイズ**: 色当て・知識テスト用のクイズモード
- **カメラ連携**: リアルタイムプレビュー、色抽出／サンプリング
- **色覚特性シミュレーション**: カメラ映像に対する CVD シミュレーション

### 画面（ページ）

- **Home**: 概要・ナビゲーション
- **Picker**: カラーピッカー
- **Convert**: 変換ツール
- **Image Adjust**: 画像の色調補正
- **Color Catalog / Detail**: JIS 色の一覧と詳細
- **Camera / Camera CVD**: カメラプレビュー、色覚特性シミュレーション
- **Color Quiz**: クイズモード
- **My Page**: お気に入り・パレット関連
- **Theory**: 色彩理論の概要

### 技術スタック

- **フロントエンド**: React + Vite + TypeScript
- **Web API**: Canvas API、MediaDevices（カメラ）
- **データ**: `public/jis_colors.csv`（JIS）、ローカル保存（お気に入り/履歴）
- **PWA**: `vite-plugin-pwa` による Service Worker/manifest

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# ビルド成果物のローカルプレビュー
npm run preview
```

### 今後の拡張（予定）

- **パレット**: 生成（画像抽出/トレンド/AI）、保存・共有、エクスポート（CSS/JSON/画像）
- **アクセシビリティ**: コントラスト比・WCAG チェック
- **高速化**: WebGL/WASM による画像処理最適化
- **プラットフォーム**: 多言語対応、ダークモード、IndexedDB 履歴強化

### ライセンス

- 後日決定
