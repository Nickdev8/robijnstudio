<svelte:options runes={false} />

<script lang="ts">
import UploadDropzone from '$lib/components/UploadDropzone.svelte';
import type { PageData } from './$types';
import type { GalleryItem, SiteContent } from '$lib/types/content';

type FormState = { error?: string; success?: boolean } | undefined;

export let data: PageData;
export let form: FormState = undefined;
const formState = form;

const normalizeContent = (input: SiteContent): SiteContent => {
	const projects = Array.isArray(input.about.projects) ? input.about.projects : [];
	const normalizedProjects = projects.map((project, index) => {
		const slug = project.slug?.trim() || `project-${index + 1}`;
		const heroImage = project.heroImage ?? { src: '', alt: '' };
		const body =
			Array.isArray(project.body) && project.body.length > 0
				? project.body.map((paragraph) => paragraph ?? '')
				: [''];

		return {
			...project,
			slug,
			heroImage: {
				src: heroImage.src ?? '',
				alt: heroImage.alt ?? ''
			},
			body,
			externalUrl: project.externalUrl ?? ''
		};
	});

	return {
		...input,
		about: {
			...input.about,
			projects: normalizedProjects
		}
	};
};

let content: SiteContent | null =
	data.authenticated && data.content ? normalizeContent(structuredClone(data.content)) : null;
let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
let errorMessage = formState?.error ?? '';

type DragSection = 'projects' | 'gallery' | 'testimonials';

const reorderList = <T>(items: T[], from: number, to: number): T[] => {
	const updated = [...items];
	const [moved] = updated.splice(from, 1);
	const targetIndex = from < to ? to - 1 : to;
	updated.splice(targetIndex, 0, moved);
	return updated;
};

let dragging: { section: DragSection | null; index: number | null } = { section: null, index: null };

const startDrag = (section: DragSection, index: number) => {
	dragging = { section, index };
};

const cancelDrag = () => {
	dragging = { section: null, index: null };
};

const allowDrop = (event: DragEvent) => {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = 'move';
	}
};

const dropOn = (section: DragSection, index: number) => {
	if (!content || dragging.section !== section || dragging.index === null) return;
	if (dragging.index === index) {
		cancelDrag();
		return;
	}

	if (section === 'projects') {
		content = {
			...content,
			about: {
				...content.about,
				projects: reorderList(content.about.projects, dragging.index, Math.min(index, content.about.projects.length - 1))
			}
		};
	}

	if (section === 'gallery') {
		content = {
			...content,
			portfolio: {
				...content.portfolio,
				gallery: reorderList(content.portfolio.gallery, dragging.index, Math.min(index, content.portfolio.gallery.length - 1))
			}
		};
	}

	if (section === 'testimonials') {
		content = {
			...content,
			about: {
				...content.about,
				testimonials: reorderList(
					content.about.testimonials,
					dragging.index,
					Math.min(index, content.about.testimonials.length - 1)
				)
			}
		};
	}

	cancelDrag();
};

const dropAtEnd = (section: DragSection) => {
	if (!content || dragging.section !== section || dragging.index === null) return;

	if (section === 'projects') {
		content = {
			...content,
			about: {
				...content.about,
				projects: reorderList(content.about.projects, dragging.index, content.about.projects.length)
			}
		};
	}

	if (section === 'gallery') {
		content = {
			...content,
			portfolio: {
				...content.portfolio,
				gallery: reorderList(content.portfolio.gallery, dragging.index, content.portfolio.gallery.length)
			}
		};
	}

	if (section === 'testimonials') {
		content = {
			...content,
			about: {
				...content.about,
				testimonials: reorderList(
					content.about.testimonials,
					dragging.index,
					content.about.testimonials.length
				)
			}
		};
	}

	cancelDrag();
};

const isDragging = (section: DragSection, index: number) =>
	dragging.section === section && dragging.index === index;

const preparePayload = (event: Event) => {
	if (!content) return;
	const form = event.currentTarget as HTMLFormElement;
	const hidden = form.elements.namedItem('payload');
	if (hidden instanceof HTMLInputElement) {
		hidden.value = JSON.stringify(content);
	}
};
const handleSubmit = (event: Event) => {
	successMessage = "";
	errorMessage = "";
	preparePayload(event);
};


	const addCTA = () => {
		if (!content) return;
		content = {
			...content,
			home: {
				...content.home,
				cta: [...content.home.cta, { title: 'Nieuw item', description: '', href: '/' }]
			}
		};
	};

	const removeCTA = (index: number) => {
		if (!content) return;
		content = {
			...content,
			home: {
				...content.home,
				cta: content.home.cta.filter((_item, i) => i !== index)
			}
		};
	};

	const addParagraph = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				paragraphs: [...content.about.paragraphs, '']
			}
		};
	};

	const removeParagraph = (index: number) => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				paragraphs: content.about.paragraphs.filter((_item, i) => i !== index)
			}
		};
	};

	const addStat = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				stats: [...content.about.stats, { label: 'Label', value: 'Waarde' }]
			}
		};
	};

	const removeStat = (index: number) => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				stats: content.about.stats.filter((_item, i) => i !== index)
			}
		};
	};

	const addProject = () => {
		if (!content) return;
		const timestamp = Date.now();
		content = {
			...content,
			about: {
				...content.about,
				projects: [
					...content.about.projects,
					{
						slug: `project-${timestamp}`,
						title: 'Nieuw project',
						description: '',
						result: '',
						videoUrl: '',
						heroImage: { src: '', alt: '' },
						body: [''],
						externalUrl: ''
					}
				]
			}
		};
	};

	const removeProject = (index: number) => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				projects: content.about.projects.filter((_item, i) => i !== index)
			}
		};
	};

	const addProjectParagraph = (projectIndex: number) => {
		if (!content) return;
		const projects = [...content.about.projects];
		const target = { ...projects[projectIndex] };
		target.body = [...target.body, ''];
		projects[projectIndex] = target;
		content = {
			...content,
			about: {
				...content.about,
				projects
			}
		};
	};

	const removeProjectParagraph = (projectIndex: number, paragraphIndex: number) => {
		if (!content) return;
		const projects = [...content.about.projects];
		const target = { ...projects[projectIndex] };
		target.body = target.body.filter((_item, idx) => idx !== paragraphIndex);
		if (!target.body.length) {
			target.body = [''];
		}
		projects[projectIndex] = target;
		content = {
			...content,
			about: {
				...content.about,
				projects
			}
		};
	};

	

	const addTestimonial = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				testimonials: [
					...content.about.testimonials,
					{ quote: 'Nieuw citaat', source: '— Naam, functie' }
				]
			}
		};
	};

	const removeTestimonial = (index: number) => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				testimonials: content.about.testimonials.filter((_item, i) => i !== index)
			}
		};
	};

const addGalleryItem = () => {
		if (!content) return;
		content = {
			...content,
			portfolio: {
				...content.portfolio,
				gallery: [
					...content.portfolio.gallery,
					{ src: 'https://', alt: 'Nieuw beeld', size: 'square' as GalleryItem['size'] }
				]
			}
		};
	};

const sectionNav = [
	{ id: 'home', label: 'Home' },
	{ id: 'about', label: 'Over' },
	{ id: 'projects', label: 'Projectcases' },
	{ id: 'testimonials', label: 'Testimonials' },
	{ id: 'portfolio', label: 'Portfolio' },
	{ id: 'contact', label: 'Contact' }
] as const;

	const removeGalleryItem = (index: number) => {
		if (!content) return;
		content = {
			...content,
			portfolio: {
				...content.portfolio,
				gallery: content.portfolio.gallery.filter((_item, i) => i !== index)
			}
		};
	};

	const addBullet = () => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				bullets: [...content.contact.bullets, 'Nieuw punt']
			}
		};
	};

	const removeBullet = (index: number) => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				bullets: content.contact.bullets.filter((_item, i) => i !== index)
			}
		};
	};

	const addPackage = () => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				packages: [
					...content.contact.packages,
					{
						id: `pakket-${content.contact.packages.length + 1}`,
						title: 'Nieuw pakket',
						description: '',
						price: '€0'
					}
				]
			}
		};
	};

	const removePackage = (index: number) => {
		if (!content) return;
		content = {
			...content,
			contact: {
				...content.contact,
				packages: content.contact.packages.filter((_item, i) => i !== index)
			}
		};
	};
</script>

<svelte:head>
	<title>Admin | Beau Robijn Fotografie</title>
</svelte:head>

<div class="flex flex-1 flex-col bg-neutral-50">
	<div class="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
		{#if !data.authenticated}
			<section class="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
				<h1 class="font-display text-2xl text-neutral-900">Beheer</h1>
				<p class="text-sm text-neutral-500">
					Log in met het beheerderswachtwoord om teksten en beelden te updaten.
				</p>
				<form method="post" action="?/login" class="space-y-6">
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Wachtwoord</span>
						<input
							type="password"
							name="password"
							required
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>
					{#if formState?.error}
						<p class="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{formState.error}</p>
					{/if}
					<button
						type="submit"
						class="font-display inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800"
					>
						Inloggen
					</button>
				</form>
			</section>
		{:else if content}
			<div class="mb-10 flex flex-wrap items-center justify-between gap-4">
				<h1 class="font-display text-3xl text-neutral-900">Beheer content</h1>
				<form method="post" action="?/logout">
					<button
						type="submit"
						class="rounded-full border border-neutral-300 px-5 py-2 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
					>
						Log uit
					</button>
				</form>
			</div>

			{#if successMessage}
				<p class="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
			{/if}

				{#if errorMessage}
					<p class="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
				{/if}

				<nav
					class="mb-8 flex flex-wrap gap-3 rounded-full border border-neutral-300 bg-white/80 px-4 py-3 text-[0.65rem] uppercase tracking-[0.28em] text-neutral-500 shadow-sm sm:justify-center sm:gap-4 sm:text-xs"
					aria-label="Secties"
				>
					{#each sectionNav as section}
						<a
							href={`#${section.id}`}
							class="rounded-full border border-transparent px-4 py-2 transition hover:border-neutral-900 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
						>
							{section.label}
						</a>
					{/each}
				</nav>

				<form
					method="post"
					action="?/save"
					onsubmit={handleSubmit}
					class="space-y-10"
			>
				<input type="hidden" name="payload" value="" />

					<section id="home" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
						<h2 class="font-display text-2xl text-neutral-900">Home</h2>
					<div class="mt-6 grid gap-6">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Tagline</span>
							<input
								type="text"
								bind:value={content.home.tagline}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Titel</span>
								<input
									type="text"
									bind:value={content.home.title}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Subtitel</span>
								<input
									type="text"
									bind:value={content.home.subtitle}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Intro</span>
							<textarea
								rows="3"
								bind:value={content.home.description}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Hero afbeelding URL</span>
								<input
									type="url"
									bind:value={content.home.heroImage.src}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
								<UploadDropzone bind:url={content.home.heroImage.src} />
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Hero alt-tekst</span>
								<input
									type="text"
									bind:value={content.home.heroImage.alt}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Hero label</span>
							<input
								type="text"
								bind:value={content.home.heroLabel}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-display text-lg text-neutral-900">CTA-items</h3>
								<button
									type="button"
									onclick={addCTA}
									class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
								>
									Toevoegen
								</button>
							</div>
							<div class="space-y-4">
								{#each content.home.cta as cta, index}
									<div class="rounded-2xl border border-neutral-200 p-4">
										<div class="flex items-start justify-between gap-4">
											<p class="font-display text-neutral-900">Item {index + 1}</p>
											<button
												type="button"
												onclick={() => removeCTA(index)}
												class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
											>
												Verwijder
											</button>
										</div>
										<div class="mt-4 grid gap-4 sm:grid-cols-2">
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Titel</span>
												<input
													type="text"
													bind:value={cta.title}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Link</span>
												<input
													type="text"
													bind:value={cta.href}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Omschrijving</span>
											<textarea
												rows="2"
												bind:value={cta.description}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											></textarea>
										</label>
									</div>
								{/each}
							</div>
						</div>

						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Beschikbaarheidstekst</span>
							<input
								type="text"
								bind:value={content.home.availability}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>
				</section>

					<section id="about" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
				<h2 class="font-display text-2xl text-neutral-900">Over</h2>
				<div class="mt-6 grid gap-6">
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Intro tagline</span>
						<input
							type="text"
							bind:value={content.about.introTag}
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Kop</span>
						<input
							type="text"
							bind:value={content.about.headline}
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<h3 class="font-display text-lg text-neutral-900">Paragrafen</h3>
							<button
								type="button"
								onclick={addParagraph}
								class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
							>
								Toevoegen
							</button>
						</div>
						{#each content.about.paragraphs as paragraph, index}
							<div class="rounded-2xl border border-neutral-200 p-4">
								<div class="flex items-start justify-between gap-4">
									<p class="font-display text-neutral-900">Paragraaf {index + 1}</p>
									<button
										type="button"
										onclick={() => removeParagraph(index)}
										class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
									>
										Verwijder
									</button>
								</div>
								<textarea
									rows="3"
									bind:value={content.about.paragraphs[index]}
									class="mt-4 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								></textarea>
							</div>
						{/each}
					</div>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<h3 class="font-display text-lg text-neutral-900">Stats</h3>
							<button
								type="button"
								onclick={addStat}
								class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
							>
								Toevoegen
							</button>
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
							{#each content.about.stats as stat, index}
								<div class="rounded-2xl border border-neutral-200 p-4">
									<div class="flex items-center justify-between gap-4">
										<p class="font-display text-neutral-900">Item {index + 1}</p>
										<button
											type="button"
											onclick={() => removeStat(index)}
											class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
										>
											Verwijder
										</button>
									</div>
									<label class="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
										<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Label</span>
										<input
											type="text"
											bind:value={content.about.stats[index].label}
											class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
										/>
									</label>
									<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
										<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Waarde</span>
										<input
											type="text"
											bind:value={content.about.stats[index].value}
											class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
										/>
									</label>
								</div>
							{/each}
						</div>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Portret URL</span>
							<input
								type="url"
								bind:value={content.about.portrait.src}
								class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
							<UploadDropzone bind:url={content.about.portrait.src} />
						</label>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Portret alt-tekst</span>
							<input
								type="text"
								bind:value={content.about.portrait.alt}
								class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>
				</div>
			</section>

			<section id="projects" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="font-display text-2xl text-neutral-900">Projectcases</h2>
						<p class="text-sm text-neutral-500">Worden gebruikt op de Over-pagina én als losse projectpagina.</p>
					</div>
					<button
						type="button"
						onclick={addProject}
						class="mt-2 inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900 sm:mt-0"
					>
						Nieuw project
					</button>
				</div>

				<div class="mt-6 space-y-4" role="list">
					{#each content.about.projects as project, index}
						<div
							class={`rounded-2xl border border-neutral-200 p-5 ${isDragging('projects', index) ? 'border-rose-500/60 bg-rose-50/40' : ''}`}
							draggable={true}
							ondragstart={() => startDrag('projects', index)}
							ondragover={allowDrop}
							ondrop={() => dropOn('projects', index)}
							ondragend={cancelDrag}
							role="listitem"
							aria-grabbed={isDragging('projects', index)}
						>
							<div class="flex flex-wrap items-center justify-between gap-4">
								<p class="font-display text-lg text-neutral-900">Project {index + 1}</p>
								<div class="flex items-center gap-3">
									<button
										type="button"
										onclick={() => removeProject(index)}
										class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
									>
										Verwijder
									</button>
								</div>
							</div>

							<div class="mt-4 grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Titel</span>
									<input
										type="text"
										bind:value={content.about.projects[index].title}
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									/>
								</label>
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Slug</span>
									<input
										type="text"
										bind:value={content.about.projects[index].slug}
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
										placeholder="bijv. soft-echo"
									/>
								</label>
							</div>

							<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Korte omschrijving</span>
								<textarea
									rows="2"
									bind:value={content.about.projects[index].description}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								></textarea>
							</label>

							<div class="mt-3 grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Resultaat</span>
									<input
										type="text"
										bind:value={content.about.projects[index].result}
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									/>
								</label>
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Video (embed URL)</span>
									<input
										type="url"
										bind:value={content.about.projects[index].videoUrl}
										placeholder="https://player.vimeo.com/..."
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									/>
								</label>
							</div>

							<div class="mt-3 grid gap-4 sm:grid-cols-2">
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Hero-afbeelding</span>
									<input
										type="url"
										bind:value={content.about.projects[index].heroImage.src}
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									/>
									<UploadDropzone bind:url={content.about.projects[index].heroImage.src} />
								</label>
								<label class="flex flex-col gap-2 text-sm text-neutral-600">
									<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Hero alt-tekst</span>
									<input
										type="text"
										bind:value={content.about.projects[index].heroImage.alt}
										class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									/>
								</label>
							</div>

							<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Externe case (optioneel)</span>
								<input
									type="url"
									bind:value={content.about.projects[index].externalUrl}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
									placeholder="https://..."
								/>
							</label>

							<div class="mt-4 space-y-3">
								<div class="flex items-center justify-between">
									<p class="font-display text-neutral-900">Detailparagrafen</p>
									<button
										type="button"
										onclick={() => addProjectParagraph(index)}
										class="rounded-full border border-neutral-300 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
									>
										Paragraaf toevoegen
									</button>
								</div>
								{#each project.body as paragraph, bodyIndex}
									<div class="rounded-2xl border border-neutral-200 p-4">
										<div class="flex items-start justify-between gap-4">
											<p class="font-display text-neutral-900">Paragraaf {bodyIndex + 1}</p>
											{#if project.body.length > 1}
												<button
													type="button"
													onclick={() => removeProjectParagraph(index, bodyIndex)}
													class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
												>
													Verwijder
												</button>
											{/if}
										</div>
										<textarea
											rows="3"
											bind:value={content.about.projects[index].body[bodyIndex]}
											class="mt-4 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
										></textarea>
									</div>
								{/each}
							</div>
						</div>
					{/each}

					{#if content.about.projects.length > 1}
						<div
							class="flex h-10 items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-[0.65rem] uppercase tracking-[0.28em] text-neutral-400"
							ondragover={allowDrop}
							ondrop={() => dropAtEnd('projects')}
							role="button"
							aria-label="Plaats project achteraan"
						>
							Plaats hier
						</div>
					{/if}
				</div>
			</section>

			<section id="testimonials" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<h2 class="font-display text-2xl text-neutral-900">Testimonials</h2>
					<button
						type="button"
						onclick={addTestimonial}
						class="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
					>
						Nieuwe quote
					</button>
				</div>

				<div class="mt-6 space-y-4" role="list">
					{#each content.about.testimonials as testimonial, index}
						<div
							class={`rounded-2xl border border-neutral-200 p-4 ${isDragging('testimonials', index) ? 'border-rose-500/60 bg-rose-50/40' : ''}`}
							draggable={true}
							ondragstart={() => startDrag('testimonials', index)}
							ondragover={allowDrop}
							ondrop={() => dropOn('testimonials', index)}
							ondragend={cancelDrag}
							role="listitem"
							aria-grabbed={isDragging('testimonials', index)}
						>
							<div class="flex items-start justify-between gap-4">
								<p class="font-display text-neutral-900">Testimonial {index + 1}</p>
								<button
									type="button"
									onclick={() => removeTestimonial(index)}
									class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
								>
									Verwijder
								</button>
							</div>
							<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Quote</span>
								<textarea
									rows="3"
									bind:value={content.about.testimonials[index].quote}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								></textarea>
							</label>
							<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Bron</span>
								<input
									type="text"
									bind:value={content.about.testimonials[index].source}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
					{/each}

					{#if content.about.testimonials.length > 1}
						<div
							class="flex h-10 items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-[0.65rem] uppercase tracking-[0.28em] text-neutral-400"
							ondragover={allowDrop}
							ondrop={() => dropAtEnd('testimonials')}
							role="button"
							aria-label="Plaats testimonial achteraan"
						>
							Plaats hier
						</div>
					{/if}
				</div>
			</section>

			<section id="portfolio" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
				<h2 class="font-display text-2xl text-neutral-900">Portfolio</h2>
				<div class="mt-6 grid gap-6">
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Tagline</span>
						<input
							type="text"
							bind:value={content.portfolio.tagline}
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Intro</span>
							<textarea
								rows="3"
								bind:value={content.portfolio.description}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-display text-lg text-neutral-900">Afbeeldingen</h3>
								<button
									type="button"
									onclick={addGalleryItem}
									class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
								>
									Toevoegen
								</button>
							</div>
				<div class="space-y-4" role="list">
					{#each content.portfolio.gallery as image, index}
						<div
							class={`rounded-2xl border border-neutral-200 p-4 ${isDragging('gallery', index) ? 'border-rose-500/60 bg-rose-50/40' : ''}`}
							draggable={true}
							ondragstart={() => startDrag('gallery', index)}
							ondragover={allowDrop}
							ondrop={() => dropOn('gallery', index)}
							ondragend={cancelDrag}
							role="listitem"
							aria-grabbed={isDragging('gallery', index)}
						>
										<div class="flex items-start justify-between gap-4">
											<p class="font-display text-neutral-900">Beeld {index + 1}</p>
											<button
												type="button"
												onclick={() => removeGalleryItem(index)}
												class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
											>
												Verwijder
											</button>
										</div>
										<div class="mt-4 grid gap-4 sm:grid-cols-2">
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Afbeelding URL</span>
												<input
													type="url"
													bind:value={content.portfolio.gallery[index].src}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
												<UploadDropzone bind:url={content.portfolio.gallery[index].src} />
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Alt-tekst</span>
												<input
													type="text"
													bind:value={content.portfolio.gallery[index].alt}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Formaat</span>
											<select
												bind:value={content.portfolio.gallery[index].size}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											>
												<option value="square">Vierkant</option>
												<option value="wide">Breed</option>
												<option value="tall">Hoog</option>
											</select>
										</label>
									</div>
								{/each}
					{#if content.portfolio.gallery.length > 1}
						<div
							class="flex h-10 items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-[0.65rem] uppercase tracking-[0.28em] text-neutral-400"
							ondragover={allowDrop}
							ondrop={() => dropAtEnd('gallery')}
							role="button"
							aria-label="Plaats beeld achteraan"
						>
							Plaats hier
						</div>
					{/if}
				</div>
						</div>
					</div>
				</section>

			<section id="contact" class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8 scroll-mt-28">
				<h2 class="font-display text-2xl text-neutral-900">Contact</h2>
				<div class="mt-6 grid gap-6">
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Tagline</span>
						<input
							type="text"
							bind:value={content.contact.tagline}
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>
					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Intro</span>
						<textarea
								rows="3"
								bind:value={content.contact.description}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-display text-lg text-neutral-900">Highlights</h3>
								<button
									type="button"
									onclick={addBullet}
									class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
								>
									Toevoegen
								</button>
							</div>
							<div class="space-y-3">
								{#each content.contact.bullets as bullet, index}
									<div class="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3">
										<input
											type="text"
											bind:value={content.contact.bullets[index]}
											class="flex-1 border-none bg-transparent text-sm text-neutral-700 outline-none focus:ring-0"
										/>
										<button
											type="button"
											onclick={() => removeBullet(index)}
											class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
										>
											×
										</button>
									</div>
								{/each}
							</div>
						</div>

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-display text-lg text-neutral-900">Pakketten</h3>
								<button
									type="button"
									onclick={addPackage}
									class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
								>
									Toevoegen
								</button>
							</div>
							<div class="space-y-4">
								{#each content.contact.packages as pkg, index}
									<div class="rounded-2xl border border-neutral-200 p-4">
										<div class="flex items-start justify-between gap-4">
											<p class="font-display text-neutral-900">Pakket {index + 1}</p>
											<button
												type="button"
												onclick={() => removePackage(index)}
												class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
											>
												Verwijder
											</button>
										</div>
										<div class="mt-4 grid gap-4 sm:grid-cols-2">
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">ID / referentie</span>
												<input
													type="text"
													bind:value={content.contact.packages[index].id}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Titel</span>
												<input
													type="text"
													bind:value={content.contact.packages[index].title}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Omschrijving</span>
											<textarea
												rows="2"
												bind:value={content.contact.packages[index].description}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											></textarea>
										</label>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">Prijs</span>
											<input
												type="text"
												bind:value={content.contact.packages[index].price}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											/>
										</label>
									</div>
								{/each}
							</div>
						</div>

						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Outro</span>
							<textarea
								rows="2"
								bind:value={content.contact.outro}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Contact e-mail</span>
							<input
								type="email"
								bind:value={content.contact.email}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>
				</section>

				<button
					type="submit"
					class="fixed bottom-6 right-6 z-20 font-display inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-xs uppercase tracking-[0.4em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 md:bottom-10 md:right-10"
				>
					Sla wijzigingen op
				</button>
			</form>
		{/if}
	</div>
</div>
