<svelte:options runes={false} />

<script lang="ts">
import type { PageData } from './$types';
import type { GalleryItem, SiteContent } from '$lib/types/content';

type FormState = { error?: string; success?: boolean } | undefined;

let { data }: { data: PageData } = $props();
const formState = (data as { form?: FormState }).form;

let content: SiteContent | null =
	data.authenticated && data.content ? structuredClone(data.content) : null;
let successMessage = formState?.success ? 'Wijzigingen opgeslagen.' : '';
let errorMessage = formState?.error ?? '';

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
				cta: content.home.cta.filter((_, i) => i !== index)
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
				paragraphs: content.about.paragraphs.filter((_, i) => i !== index)
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
				stats: content.about.stats.filter((_, i) => i !== index)
			}
		};
	};

	const addProject = () => {
		if (!content) return;
		content = {
			...content,
			about: {
				...content.about,
				projects: [
					...content.about.projects,
					{ title: 'Nieuw project', description: '', href: 'https://example.com' }
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
				projects: content.about.projects.filter((_, i) => i !== index)
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

	const removeGalleryItem = (index: number) => {
		if (!content) return;
		content = {
			...content,
			portfolio: {
				...content.portfolio,
				gallery: content.portfolio.gallery.filter((_, i) => i !== index)
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
				bullets: content.contact.bullets.filter((_, i) => i !== index)
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
				packages: content.contact.packages.filter((_, i) => i !== index)
			}
		};
	};
</script>

<svelte:head>
	<title>Admin | Beau Robijn Studios</title>
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
						<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Wachtwoord</span>
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

			<form
				method="post"
				action="?/save"
				onsubmit={handleSubmit}
				class="space-y-10"
			>
				<input type="hidden" name="payload" value="" />

				<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="font-display text-2xl text-neutral-900">Home</h2>
					<div class="mt-6 grid gap-6">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Tagline</span>
							<input
								type="text"
								bind:value={content.home.tagline}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Titel</span>
								<input
									type="text"
									bind:value={content.home.title}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Subtitel</span>
								<input
									type="text"
									bind:value={content.home.subtitle}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Intro</span>
							<textarea
								rows="3"
								bind:value={content.home.description}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Hero afbeelding URL</span>
								<input
									type="url"
									bind:value={content.home.heroImage.src}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Hero alt-tekst</span>
								<input
									type="text"
									bind:value={content.home.heroImage.alt}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Hero label</span>
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
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Titel</span>
												<input
													type="text"
													bind:value={cta.title}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Link</span>
												<input
													type="text"
													bind:value={cta.href}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Omschrijving</span>
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
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Beschikbaarheidstekst</span>
							<input
								type="text"
								bind:value={content.home.availability}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>
				</section>

				<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="font-display text-2xl text-neutral-900">Over</h2>
					<div class="mt-6 grid gap-6">
						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Intro tag</span>
								<input
									type="text"
									bind:value={content.about.introTag}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Kop</span>
								<input
									type="text"
									bind:value={content.about.headline}
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>

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
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Label</span>
											<input
												type="text"
												bind:value={content.about.stats[index].label}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											/>
										</label>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Waarde</span>
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

						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-display text-lg text-neutral-900">Projecten</h3>
								<button
									type="button"
									onclick={addProject}
									class="rounded-full border border-neutral-300 px-4 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
								>
									Toevoegen
								</button>
							</div>
							<div class="space-y-4">
								{#each content.about.projects as project, index}
									<div class="rounded-2xl border border-neutral-200 p-4">
										<div class="flex items-start justify-between gap-4">
											<p class="font-display text-neutral-900">Project {index + 1}</p>
											<button
												type="button"
												onclick={() => removeProject(index)}
												class="text-xs uppercase tracking-[0.3em] text-neutral-400 transition hover:text-red-500"
											>
												Verwijder
											</button>
										</div>
										<div class="mt-4 grid gap-4 sm:grid-cols-2">
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Titel</span>
												<input
													type="text"
													bind:value={content.about.projects[index].title}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Link</span>
												<input
													type="url"
													bind:value={content.about.projects[index].href}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Omschrijving</span>
											<textarea
												rows="2"
												bind:value={content.about.projects[index].description}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											></textarea>
										</label>
									</div>
								{/each}
							</div>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Testimonial</span>
								<textarea
									rows="3"
									bind:value={content.about.testimonial.quote}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								></textarea>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Bron</span>
								<input
									type="text"
									bind:value={content.about.testimonial.source}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Portret URL</span>
								<input
									type="url"
									bind:value={content.about.portrait.src}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Portret alt-tekst</span>
								<input
									type="text"
									bind:value={content.about.portrait.alt}
									class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
								/>
							</label>
						</div>
					</div>
				</section>

				<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="font-display text-2xl text-neutral-900">Portfolio</h2>
					<div class="mt-6 grid gap-6">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Intro</span>
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
							<div class="space-y-4">
								{#each content.portfolio.gallery as image, index}
									<div class="rounded-2xl border border-neutral-200 p-4">
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
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Afbeelding URL</span>
												<input
													type="url"
													bind:value={content.portfolio.gallery[index].src}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Alt-tekst</span>
												<input
													type="text"
													bind:value={content.portfolio.gallery[index].alt}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-4 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Formaat</span>
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
							</div>
						</div>
					</div>
				</section>

				<section class="rounded-3xl border border-neutral-200 bg-white/95 p-6 sm:p-8">
					<h2 class="font-display text-2xl text-neutral-900">Contact</h2>
					<div class="mt-6 grid gap-6">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Intro</span>
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
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">ID / referentie</span>
												<input
													type="text"
													bind:value={content.contact.packages[index].id}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
											<label class="flex flex-col gap-2 text-sm text-neutral-600">
												<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Titel</span>
												<input
													type="text"
													bind:value={content.contact.packages[index].title}
													class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
												/>
											</label>
										</div>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Omschrijving</span>
											<textarea
												rows="2"
												bind:value={content.contact.packages[index].description}
												class="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
											></textarea>
										</label>
										<label class="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
											<span class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Prijs</span>
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
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Outro</span>
							<textarea
								rows="2"
								bind:value={content.contact.outro}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							></textarea>
						</label>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Contact e-mail</span>
							<input
								type="email"
								bind:value={content.contact.email}
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>
				</section>

				<div class="flex flex-wrap items-center justify-between gap-4">
					<p class="text-xs text-neutral-500">Vergeet niet op te slaan. Wijzigingen worden direct live gezet.</p>
					<button
						type="submit"
						class="font-display inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-xs uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800"
					>
						Sla wijzigingen op
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
