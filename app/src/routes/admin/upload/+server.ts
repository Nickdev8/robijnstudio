import { error, json, type RequestHandler } from '@sveltejs/kit';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { getContentDirectory } from '$lib/server/content';
import { isAdminAuthenticated } from '$lib/server/admin';

const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25 MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/jpg': '.jpg',
	'image/pjpeg': '.jpg',
	'image/png': '.png',
	'image/x-png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'image/svg+xml': '.svg',
	'image/avif': '.avif'
};
const ALLOWED_EXTENSIONS: Record<string, string> = {
	'.jpg': '.jpg',
	'.jpeg': '.jpg',
	'.png': '.png',
	'.webp': '.webp',
	'.gif': '.gif',
	'.svg': '.svg',
	'.avif': '.avif'
};

const normalizeMimeType = (value: string | undefined | null) =>
	value ? value.split(';', 1)[0]?.trim().toLowerCase() ?? '' : '';

const resolveExtension = (file: File): string | null => {
	const mimeType = normalizeMimeType(file.type);
	if (mimeType && mimeType in ALLOWED_MIME_TYPES) {
		return ALLOWED_MIME_TYPES[mimeType];
	}

	const originalName = file.name ?? '';
	if (originalName) {
		const rawExtension = extname(originalName).toLowerCase();
		if (rawExtension in ALLOWED_EXTENSIONS) {
			return ALLOWED_EXTENSIONS[rawExtension];
		}
	}

	return null;
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
		throw error(413, 'Bestand is te groot (maximaal 25 MB).');
	}

	const extension = resolveExtension(file);
	if (!extension) {
		throw error(415, 'Alleen afbeeldingsbestanden zijn toegestaan (jpg, png, webp, gif, svg, avif).');
	}

	const uploadsDir = join(getContentDirectory(), 'uploads');
	await mkdir(uploadsDir, { recursive: true });

	let buffer: Buffer;
	try {
		buffer = Buffer.from(await file.arrayBuffer());
	} catch {
		throw error(500, 'Het bestand kon niet worden gelezen. Probeer het opnieuw.');
	}

	const baseIdentifier = `${Date.now()}-${randomUUID()}`;
	let savedFilename: string | null = null;

	for (let attempt = 0; attempt < 5; attempt += 1) {
		const suffix = attempt === 0 ? '' : `-${attempt}`;
		const candidateName = `${baseIdentifier}${suffix}${extension}`;
		const destination = join(uploadsDir, candidateName);

		try {
			await writeFile(destination, buffer, { flag: 'wx' });
			savedFilename = candidateName;
			break;
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'code' in err) {
				const code = (err as { code: string }).code;
				if (code === 'EEXIST') {
					continue;
				}

				if (code === 'EACCES' || code === 'EPERM') {
					throw error(500, 'De server heeft onvoldoende rechten om het bestand op te slaan.');
				}

				if (code === 'ENOSPC') {
					throw error(500, 'De server heeft onvoldoende schijfruimte om het bestand op te slaan.');
				}
			}
			throw error(500, 'Opslaan van het bestand is mislukt. Probeer het opnieuw.');
		}
	}

	if (!savedFilename) {
		throw error(500, 'Opslaan van het bestand is mislukt. Probeer het later opnieuw.');
	}

	return json({ url: `/uploads/${savedFilename}` });
};
