import { redirect, fail } from '@sveltejs/kit';
import { readContent, writeContent } from '$lib/server/content';
import type { SiteContent } from '$lib/types/content';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const ADMIN_COOKIE = 'robijnstudio_admin';
const ADMIN_PASSWORD = env.ADMIN_PASSWORD ?? 'robijnstudio';

export const load: PageServerLoad = async ({ cookies }) => {
	const authenticated = cookies.get(ADMIN_COOKIE) === 'true';
	if (!authenticated) {
		return { authenticated: false };
	}

	const content = await readContent();
	return { authenticated: true, content };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const password = formData.get('password');

		if (typeof password !== 'string' || password.trim() === '') {
			return fail(400, { error: 'Voer een wachtwoord in.' });
		}

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Onjuist wachtwoord.' });
		}

		cookies.set(ADMIN_COOKIE, 'true', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 8 // 8 uur
		});

		throw redirect(303, '/admin');
	},
	logout: async ({ cookies }) => {
		cookies.delete(ADMIN_COOKIE, { path: '/' });
		throw redirect(303, '/admin');
	},
	save: async ({ request, cookies }) => {
		if (cookies.get(ADMIN_COOKIE) !== 'true') {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const formData = await request.formData();
		const payload = formData.get('payload');

		if (typeof payload !== 'string') {
			return fail(400, { error: 'Ongeldige gegevens.' });
		}

		let parsed: SiteContent;
		try {
			parsed = JSON.parse(payload) as SiteContent;
		} catch (error) {
			return fail(400, { error: 'Kan invoer niet lezen. Controleer de velden en probeer opnieuw.' });
		}

		await writeContent(parsed);

		return { success: true };
	}
};
