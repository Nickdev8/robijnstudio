import { access, copyFile, mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import type { SiteContent } from '$lib/types/content';
import { env } from '$env/dynamic/private';

const DEFAULT_CONTENT_PATH = join(process.cwd(), 'content.json');
const DEFAULT_CONTENT_DIR = dirname(DEFAULT_CONTENT_PATH);
const CUSTOM_FILE = env.CONTENT_FILE?.trim();
const CUSTOM_DIR = env.CONTENT_DIR?.trim();

const RESOLVED_CONTENT_PATH = CUSTOM_FILE
	? CUSTOM_FILE
	: join(CUSTOM_DIR ?? DEFAULT_CONTENT_DIR, 'content.json');
const RESOLVED_CONTENT_DIR = CUSTOM_FILE
	? dirname(CUSTOM_FILE)
	: CUSTOM_DIR ?? DEFAULT_CONTENT_DIR;

let ensured = false;

async function ensureContentFile(): Promise<string> {
	if (ensured) return RESOLVED_CONTENT_PATH;

	try {
		await access(RESOLVED_CONTENT_PATH);
		ensured = true;
		return RESOLVED_CONTENT_PATH;
	} catch (error) {
		// If we're already pointing at the default file and can't access it,
		// surface the original error rather than trying to copy.
		if (RESOLVED_CONTENT_PATH === DEFAULT_CONTENT_PATH) {
			throw error;
		}
	}

	await mkdir(dirname(RESOLVED_CONTENT_PATH), { recursive: true });
	await copyFile(DEFAULT_CONTENT_PATH, RESOLVED_CONTENT_PATH);
	ensured = true;
	return RESOLVED_CONTENT_PATH;
}

export async function readContent(): Promise<SiteContent> {
	const path = await ensureContentFile();
	const file = await readFile(path, { encoding: 'utf-8' });
	return JSON.parse(file) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
	const path = await ensureContentFile();
	const serialized = JSON.stringify(content, null, 2);
	await writeFile(path, `${serialized}\n`, { encoding: 'utf-8' });
}

export function getContentDirectory(): string {
	return RESOLVED_CONTENT_DIR;
}
