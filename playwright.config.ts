import { defineConfig, devices } from '@playwright/test';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const appBase = repoName ? `/${repoName}/` : '/';

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: `http://127.0.0.1:4173${appBase}`,
    viewport: { width: 1280, height: 720 },
    locale: 'ja-JP',
    reducedMotion: 'reduce',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
