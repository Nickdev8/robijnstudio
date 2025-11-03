import { access, mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import type { SiteContent } from '$lib/types/content';
import { env } from '$env/dynamic/private';

const DEFAULTS_PATH = join(process.cwd(), 'defaults.json');
const DEFAULTS_DIR = dirname(DEFAULTS_PATH);
const CUSTOM_OVERRIDES_FILE = env.CONTENT_FILE?.trim();
const CUSTOM_OVERRIDES_DIR = env.CONTENT_DIR?.trim();

const RESOLVED_OVERRIDES_PATH = CUSTOM_OVERRIDES_FILE
	? CUSTOM_OVERRIDES_FILE
	: join(CUSTOM_OVERRIDES_DIR ?? DEFAULTS_DIR, 'overrides.json');
const RESOLVED_OVERRIDES_DIR = dirname(RESOLVED_OVERRIDES_PATH);

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) return true;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((value, index) => deepEqual(value, b[index]));
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		return keysA.every((key) => deepEqual(a[key], b[key]));
	}

	return false;
}

function mergeValues<T>(defaults: T, overrides: unknown): T {
	if (overrides === undefined) {
		return defaults;
	}

	if (Array.isArray(defaults) && Array.isArray(overrides)) {
		return overrides as T;
	}

	if (isPlainObject(defaults) && isPlainObject(overrides)) {
		const keys = new Set([...Object.keys(defaults), ...Object.keys(overrides)]);
		const merged: Record<string, unknown> = {};

		for (const key of keys) {
			merged[key] = mergeValues(
				(defaults as Record<string, unknown>)[key],
				(overrides as Record<string, unknown>)[key]
			);
		}

		return merged as T;
	}

	return overrides as T;
}

function extractDiff(defaults: unknown, value: unknown): unknown {
	if (Array.isArray(value)) {
		if (Array.isArray(defaults) && deepEqual(defaults, value)) {
			return undefined;
		}
		return value;
	}

	if (isPlainObject(value)) {
		const result: Record<string, unknown> = {};
		const valueRecord = value as Record<string, unknown>;
		const defaultsRecord = isPlainObject(defaults) ? (defaults as Record<string, unknown>) : {};

		for (const [key, nestedValue] of Object.entries(valueRecord)) {
			const diff = extractDiff(defaultsRecord[key], nestedValue);
			if (diff !== undefined) {
				result[key] = diff;
			}
		}

		return Object.keys(result).length > 0 ? result : undefined;
	}

	if (value === undefined) {
		return undefined;
	}

	if (deepEqual(defaults, value)) {
		return undefined;
	}

	return value;
}

async function readDefaults(): Promise<SiteContent> {
	const file = await readFile(DEFAULTS_PATH, { encoding: 'utf-8' });
	return JSON.parse(file) as SiteContent;
}

async function readOverrides(): Promise<Partial<SiteContent>> {
	try {
		const file = await readFile(RESOLVED_OVERRIDES_PATH, { encoding: 'utf-8' });
		return JSON.parse(file) as Partial<SiteContent>;
	} catch (error: unknown) {
		if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'ENOENT') {
			return {};
		}
		throw error;
	}
}

async function ensureOverridesDir(): Promise<void> {
	try {
		await access(RESOLVED_OVERRIDES_DIR);
	} catch {
		await mkdir(RESOLVED_OVERRIDES_DIR, { recursive: true });
	}
}

export async function readContent(): Promise<SiteContent> {
	const [defaults, overrides] = await Promise.all([readDefaults(), readOverrides()]);
	return mergeValues(defaults, overrides);
}

export async function writeContent(content: SiteContent): Promise<void> {
	const defaults = await readDefaults();
	const overrides = extractDiff(defaults, content);
	await ensureOverridesDir();
	const serialized = JSON.stringify(overrides ?? {}, null, 2);
	await writeFile(RESOLVED_OVERRIDES_PATH, `${serialized}\n`, { encoding: 'utf-8' });
}

export function getContentDirectory(): string {
	return RESOLVED_OVERRIDES_DIR;
}
