import type { Cookies } from '@sveltejs/kit';

export const ADMIN_COOKIE = 'robijnstudio_admin';

export function isAdminAuthenticated(cookies: Cookies): boolean {
	return cookies.get(ADMIN_COOKIE) === 'true';
}
