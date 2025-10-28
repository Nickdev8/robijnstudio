import { access, copyFile, mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import type { SiteContent } from '$lib/types/content';
import { env } from '$env/dynamic/private';

const DEFAULT_CONTENT_PATH = join(process.cwd(), 'content.json');
const RESOLVED_CONTENT_PATH = (() => {
	const customFile = env.CONTENT_FILE;
	if (customFile?.trim()) {
		return customFile;
	}

	const customDir = env.CONTENT_DIR;
	if (customDir?.trim()) {
		return join(customDir, 'content.json');
	}

	return DEFAULT_CONTENT_PATH;
})();

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
