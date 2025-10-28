import { expect, test } from '@playwright/test';

test('admin login and logout flow', async ({ page }) => {
	await page.goto('/admin');
	await expect(page.getByRole('heading', { name: 'Beheer' })).toBeVisible();

	await page.getByLabel('Wachtwoord').fill(process.env.ADMIN_PASSWORD ?? 'robijnstudio');
	await page.getByRole('button', { name: 'Inloggen' }).click();

	await expect(page.getByRole('heading', { name: 'Beheer content' })).toBeVisible();

	await page.getByRole('button', { name: 'Log uit' }).click();
	await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible();
});
