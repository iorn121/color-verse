import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Actions 上では GITHUB_REPOSITORY が "owner/repo" で入る
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const base = repo ? `/${repo}/` : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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
