import { expect, test } from '@playwright/test';

test('contact form completes successfully', async ({ page }) => {
	await page.goto('/contact');

	await page.getByLabel('Voornaam').fill('Test');
	await page.getByLabel('Achternaam').fill('Bezoeker');
	await page.getByLabel('E-mail').fill('test@example.com');
	await page.getByLabel('Portret Mini · 2 uur').check();
	await page.getByLabel('Vertel iets over je idee').fill('Ik wil graag een portretshoot in het Vondelpark.');

	await page.getByRole('button', { name: 'Verstuur aanvraag' }).click();
	await expect(page.getByText('Bedankt voor je bericht')).toBeVisible();
	await expect(page.getByText('Terug naar home')).toBeVisible();
});
