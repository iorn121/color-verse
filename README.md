# ColorVerse（カラーバース）

色の学習・ツール・分析・創作を一体化するプラットフォーム。Vite + React + TypeScript 構成、PWA 対応。

## プロジェクト名
- 正式名: **ColorVerse**
- 略称: **CV**
- 由来: 「色彩の宇宙・世界」。覚えやすくグローバルで通用。
- 他候補: Chroma Hub / Palette Pro / ColorCraft

## 要件（要約）

### コア機能カテゴリ
- 知識・学習: 色彩理論、色の心理学、配色ルール（WCAG）、カラーコード辞典（Hex/RGB/HSL/CMYK、日本の伝統色、Webセーフ、パントーン）
- ツール・変換: 画像処理（明度/彩度/コントラスト、フィルター、色相変更）、カメラ連携（リアルタイム色補正、カラーピッカー、WB調整）、パレット生成（画像抽出/AI/トレンド）
- 分析・診断: 色覚検査、配色チェッカー（コントラスト/WCAG）、画像分析（支配色/分布）
- クリエイティブ: パレットメーカー（保存/共有）、グラデーション、パターン、スキーム提案（Web/インテリア/ファッション）

### 技術要件
- フロントエンド: React + Vite、Canvas API/WebGL、MediaDevices API、PWA
- 画像処理: Canvas API（必要に応じて Fabric.js/Konva.js、WASM）
- データ管理: IndexedDB（ローカル保存、履歴）

### UI/UX
- 直感的ナビゲーション（タブ/サイドバー）、学習・ツール・ライブラリの区分
- レスポンシブ（モバイルファースト）、ダークモード、多言語（日本語/英語）

### MVP フェーズ
- Phase 1: カラーピッカー / Hex-RGB-HSL 変換 / 基本理論 / 画像アップロード→色調補正
- Phase 2: カメラ統合 / パレット生成・保存 / 配色提案AI / 知識ベース拡充
- Phase 3: リアルタイムフィルター / コミュニティ共有 / エクスポート（CSS/JSON/画像）

## 現在の実装（MVP 雛形）
- ルーティングとページ
  - `/` Home
  - `/picker` カラーピッカー
  - `/convert` Hex/RGB/HSL 変換
  - `/theory` 色彩理論（概要）
  - `/image` 画像の色調補正（Canvas、明度/彩度/コントラスト）
- コンポーネント
  - `ColorPicker`: input[type=color] + HEX/RGB/HSL 変換
  - `ConversionTool`: 双方向変換 UI
  - `ImageAdjuster`: Canvas による色調補正（ブラウザ内処理）
- PWA
  - `vite-plugin-pwa` による Service Worker 登録（dev でも有効化）、簡易 manifest

## セットアップ

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

## 構成

```
color-verse/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ ColorPicker.tsx
│  │  ├─ ConversionTool.tsx
│  │  └─ ImageAdjuster.tsx
│  ├─ lib/
│  │  └─ color.ts
│  ├─ pages/
│  │  ├─ HomePage.tsx
│  │  ├─ PickerPage.tsx
│  │  ├─ ConvertPage.tsx
│  │  ├─ TheoryPage.tsx
│  │  └─ ImageAdjustPage.tsx
│  ├─ App.tsx
│  └─ main.tsx
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## 今後の拡張（次ステップ）
- IndexedDB によるパレット保存・履歴
- アクセシビリティ（コントラスト比計算、WCAG 準拠 UI）
- カメラ連携（MediaDevices API）とリアルタイム色抽出
- 多言語（i18n）とダークモード
- 高速画像処理のための WebGL / WASM 検討

## ライセンス
後日決定


