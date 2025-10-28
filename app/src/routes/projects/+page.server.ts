import type { PageServerLoad } from './$types';
import { readContent } from '$lib/server/content';

export const load: PageServerLoad = async () => {
	const content = await readContent();
	const projects = content.about.projects ?? [];

	return {
		projects
	};
};
