import { expect, type Page, test } from '@playwright/test';

async function setPair(page: Page, foreground: string, background: string) {
  const hex = page.getByLabel('hex');
  await hex.nth(0).fill(foreground);
  await hex.nth(1).fill(background);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/compare?lng=ja');
  await expect(page.getByRole('heading', { name: '色の比較（コントラスト）' })).toBeVisible();
});

test('warns when normal text fails AA', async ({ page }) => {
  await setPair(page, '#777777', '#FFFFFF');
  await expect(page.getByRole('alert')).toContainText('コントラスト不足（AA 未達）');
  await expect(page.getByText('AAA（7:1）には届いていません')).toHaveCount(0);
  await expect(page).toHaveScreenshot('compare-aa-fail.png');
});

test('shows an informational hint when only AAA fails', async ({ page }) => {
  await setPair(page, '#767676', '#FFFFFF');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByText('AAA（7:1）には届いていません')).toBeVisible();
  await expect(page).toHaveScreenshot('compare-aaa-hint.png');
});

test('shows success for black on white and the swapped pair', async ({ page }) => {
  await setPair(page, '#000000', '#FFFFFF');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByText('AA と AAA の両方を満たしています。')).toBeVisible();
  await expect(page).toHaveScreenshot('compare-aaa-pass.png');

  await page.getByRole('button', { name: '前景と背景を入れ替え' }).click();
  await expect(page.getByText('AA と AAA の両方を満たしています。')).toBeVisible();
  await expect(page.getByLabel('hex').nth(0)).toHaveValue('#FFFFFF');
});

test('rejects an invalid hex without a contrast warning', async ({ page }) => {
  await setPair(page, '#GGG', '#FFFFFF');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('有効な HEX');
  await expect(page).toHaveScreenshot('compare-invalid.png');
});
