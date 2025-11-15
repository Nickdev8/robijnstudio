import { redirect, fail } from '@sveltejs/kit';
import { readContent, writeContent } from '$lib/server/content';
import { ADMIN_COOKIE, isAdminAuthenticated } from '$lib/server/admin';
import type { SiteContent } from '$lib/types/content';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { sendNtfyNotification, isNtfyConfigured } from '$lib/server/ntfy';

const ADMIN_PASSWORD = env.ADMIN_PASSWORD ?? 'robijnstudio';

export const load: PageServerLoad = async ({ cookies }) => {
	const authenticated = isAdminAuthenticated(cookies);
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
		if (!isAdminAuthenticated(cookies)) {
			return fail(401, { error: 'Niet geautoriseerd.' });
		}

		const previousContent = isNtfyConfigured ? await readContent() : null;

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

		if (isNtfyConfigured && previousContent) {
			const summary = summarizeSiteContentChanges(previousContent, parsed);
			if (summary) {
				await sendNtfyNotification({
					title: 'Robijn Studio bijgewerkt',
					message: summary,
					tags: ['admin', 'content']
				});
			}
		}

		return { success: true };
	}
};

function summarizeSiteContentChanges(previous: SiteContent, next: SiteContent): string | null {
	if (deepEqual(previous, next)) {
		return null;
	}

	const changedSections = collectChangedSections(previous, next);
	if (changedSections.length === 0) {
		return null;
	}

	const intro =
		changedSections.length <= 4
			? `Bijgewerkte secties: ${changedSections.join(', ')}.`
			: `Bijgewerkte ${changedSections.length} secties (o.a. ${changedSections.slice(0, 4).join(', ')}).`;

	const detailParts: string[] = [];
	appendArrayChange(detailParts, "CTA's", previous.home?.cta, next.home?.cta);
	appendArrayChange(detailParts, 'Portfolio gallery', previous.portfolio?.gallery, next.portfolio?.gallery);
	appendArrayChange(detailParts, 'Studio foto’s', previous.studio?.photos, next.studio?.photos);
	appendArrayChange(detailParts, 'Testimonials', previous.about?.testimonials, next.about?.testimonials);
	appendArrayChange(detailParts, 'Contact pakketten', previous.contact?.packages, next.contact?.packages);

	return detailParts.length ? `${intro} ${detailParts.join(' · ')}` : intro;
}

function collectChangedSections(previous: SiteContent, next: SiteContent): string[] {
	const keys = new Set([...Object.keys(previous ?? {}), ...Object.keys(next ?? {})]);
	const result: string[] = [];
	for (const key of keys) {
		const prevValue = (previous as Record<string, unknown>)[key];
		const nextValue = (next as Record<string, unknown>)[key];
		if (!deepEqual(prevValue, nextValue)) {
			result.push(key);
		}
	}
	return result;
}

function appendArrayChange(
	target: string[],
	label: string,
	previous: unknown,
	next: unknown
): void {
	const beforeCount = Array.isArray(previous) ? previous.length : 0;
	const afterCount = Array.isArray(next) ? next.length : 0;
	if (beforeCount !== afterCount) {
		target.push(`${label}: ${beforeCount}→${afterCount}`);
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) {
			return false;
		}
		return a.every((value, index) => deepEqual(value, b[index]));
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) {
			return false;
		}
		return keysA.every((key) => deepEqual(a[key], b[key]));
	}

	return false;
}
