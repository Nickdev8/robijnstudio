import { describe, expect, it } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import { ADMIN_COOKIE, isAdminAuthenticated } from './admin';

const createCookies = (value?: string): Cookies =>
	({
		get: (name: string) => {
			if (name === ADMIN_COOKIE) {
				return value ?? undefined;
			}
			return undefined;
		},
		set: () => {
			throw new Error('not implemented');
		},
		delete: () => {
			throw new Error('not implemented');
		},
		serialize: () => {
			throw new Error('not implemented');
		}
	}) as unknown as Cookies;

describe('isAdminAuthenticated', () => {
	it('returns false when cookie is missing', () => {
		const cookies = createCookies();
		expect(isAdminAuthenticated(cookies)).toBe(false);
	});

	it('returns true when cookie is present and set to true', () => {
		const cookies = createCookies('true');
		expect(isAdminAuthenticated(cookies)).toBe(true);
	});

	it('returns false when cookie contains a different value', () => {
		const cookies = createCookies('false');
		expect(isAdminAuthenticated(cookies)).toBe(false);
	});
});
