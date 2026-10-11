import { expect, test } from '@playwright/test';

/** README 末尾の動作確認文（npm run dev → トップ表示）に相当する E2E（T3 / AC4） */
test('home loads at the app root after preview (README dev flow)', async ({ page }) => {
  await page.goto('./?lng=ja');
  await expect(page.getByRole('heading', { name: 'ColorVerse', level: 1 })).toBeVisible();
  await expect(page).toHaveScreenshot('readme-verification-home.png');
});
