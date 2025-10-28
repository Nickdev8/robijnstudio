import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { SiteContent } from '$lib/types/content';

const CONTENT_PATH = join(process.cwd(), 'content.json');

export async function readContent(): Promise<SiteContent> {
	const file = await readFile(CONTENT_PATH, { encoding: 'utf-8' });
	return JSON.parse(file) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
	const serialized = JSON.stringify(content, null, 2);
	await writeFile(CONTENT_PATH, `${serialized}\n`, { encoding: 'utf-8' });
}
