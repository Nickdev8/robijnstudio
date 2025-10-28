import { error, json, type RequestHandler } from '@sveltejs/kit';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { getContentDirectory } from '$lib/server/content';
import { isAdminAuthenticated } from '$lib/server/admin';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'image/svg+xml': '.svg'
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		throw error(401, 'Niet geautoriseerd.');
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) {
		throw error(400, 'Geen bestand ontvangen.');
	}

	if (file.size === 0) {
		throw error(400, 'Het bestand is leeg.');
	}

	if (file.size > MAX_UPLOAD_SIZE) {
		throw error(413, 'Bestand is te groot (maximaal 5 MB).');
	}

	const extension = ALLOWED_MIME_TYPES[file.type];
	if (!extension) {
		throw error(415, 'Alleen afbeeldingsbestanden zijn toegestaan (jpg, png, webp, gif, svg).');
	}

	const uploadsDir = join(getContentDirectory(), 'uploads');
	await mkdir(uploadsDir, { recursive: true });

	const filename = `${Date.now()}-${randomUUID()}${extension}`;
	const destination = join(uploadsDir, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(destination, buffer, { flag: 'wx' });

	return json({ url: `/uploads/${filename}` });
};
