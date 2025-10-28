import type { RequestHandler } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const FALLBACK_SITE = 'https://robijnstudios.nl';

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: number }> = [
	{ path: '/', changefreq: 'monthly', priority: 1.0 },
	{ path: '/about', changefreq: 'yearly', priority: 0.8 },
	{ path: '/portfolio', changefreq: 'weekly', priority: 0.9 },
	{ path: '/contact', changefreq: 'monthly', priority: 0.8 }
];

const trim = (value: string | undefined | null) => (value ? value.trim() : '');

const resolveBaseUrl = (requestOrigin: string) => {
	const envCandidates = [trim(publicEnv.PUBLIC_SITE_URL), trim(privateEnv.SITE_URL), trim(privateEnv.BASE_URL)];
	const candidate = envCandidates.find((value) => value.length > 0);
	const base = candidate ?? requestOrigin ?? FALLBACK_SITE;
	return base.replace(/\/+$/, '');
};

const createUrlSet = (baseUrl: string, lastmod: string) =>
	STATIC_ROUTES.map((route) => {
		const loc = `${baseUrl}${route.path === '/' ? '/' : route.path}`;
		return `
	<url>
		<loc>${loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${route.changefreq}</changefreq>
		<priority>${route.priority.toFixed(1)}</priority>
	</url>`;
	}).join('');

export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = resolveBaseUrl(url.origin);
	const lastmod = new Date().toISOString();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${createUrlSet(baseUrl, lastmod)}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
