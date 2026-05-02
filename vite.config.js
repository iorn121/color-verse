var _a, _b;
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// GitHub Actions 上では GITHUB_REPOSITORY が "owner/repo" で入る
var repo =
  (_b =
    (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')[1]) !==
    null && _b !== void 0
    ? _b
    : '';
var base = repo ? '/'.concat(repo, '/') : '/';
export default defineConfig({
  base: base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // アイコン等を favicon.svg から自動生成（ビルド時）
      pwaAssets: {
        image: 'public/favicon.svg',
        // 2023 推奨リンクセット
        htmlPreset: '2023',
        // 生成したアイコンを manifest.icons に反映
        overrideManifestIcons: true,
      },
      manifest: {
        name: 'ColorVerse',
        short_name: 'ColorVerse',
        description: '色の学習・ツール・パレットの総合プラットフォーム',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        // GitHub Pages（サブパス）での解決を安定させる
        start_url: '.',
        scope: '.',
        lang: 'ja',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
});
