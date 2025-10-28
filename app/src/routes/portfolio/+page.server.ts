import type { PageServerLoad } from './$types';
import { readContent } from '$lib/server/content';

export const load: PageServerLoad = async () => {
	const content = await readContent();
	return {
		portfolio: content.portfolio
	};
};
