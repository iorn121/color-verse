import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
				start_url: '/',
				lang: 'ja'
			},
			devOptions: {
				enabled: true
			}
		})
	],
	server: {
		port: 5173,
		open: true
	}
});


