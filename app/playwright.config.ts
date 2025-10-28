import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		env: {
			EMAIL_TRANSPORT: 'json',
			ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? 'robijnstudio'
		}
	},
	use: {
		baseURL: 'http://localhost:4173'
	},
	testDir: 'e2e'
});
