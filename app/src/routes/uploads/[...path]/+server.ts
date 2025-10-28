import { error, type RequestHandler } from '@sveltejs/kit';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { extname, join, normalize } from 'path';
import { getContentDirectory } from '$lib/server/content';

const MIME_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml'
};

export const GET: RequestHandler = async ({ params }) => {
	const uploadsDir = join(getContentDirectory(), 'uploads');
	const requestedPath = params.path;

	if (!requestedPath) {
		throw error(404, 'Bestand niet gevonden.');
	}

	const candidatePath = normalize(join(uploadsDir, requestedPath));
	if (!candidatePath.startsWith(uploadsDir)) {
		throw error(400, 'Ongeldige bestandslocatie.');
	}

	let fileStats: Awaited<ReturnType<typeof stat>>;
	try {
		fileStats = await stat(candidatePath);
		if (!fileStats.isFile()) {
			throw error(404, 'Bestand niet gevonden.');
		}
	} catch {
		throw error(404, 'Bestand niet gevonden.');
	}

	const stream = createReadStream(candidatePath);
	const extension = extname(candidatePath).toLowerCase();
	const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';

	return new Response(stream as unknown as BodyInit, {
		headers: {
			'Content-Type': contentType,
			'Content-Length': fileStats.size.toString(),
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
