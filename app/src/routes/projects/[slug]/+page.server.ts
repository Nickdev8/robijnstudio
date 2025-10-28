import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { readContent } from '$lib/server/content';

export const load: PageServerLoad = async ({ params }) => {
	const content = await readContent();
	const project = content.about.projects.find((item) => item.slug === params.slug);

	if (!project) {
		throw error(404, 'Project niet gevonden');
	}

	const normalizedProject = {
		...project,
		heroImage: {
			src: project.heroImage?.src ?? '',
			alt: project.heroImage?.alt ?? ''
		},
		body:
			Array.isArray(project.body) && project.body.length
				? project.body
				: project.description
				? [project.description]
				: [],
		externalUrl: project.externalUrl ?? ''
	};

	return {
		project: normalizedProject
	};
};
