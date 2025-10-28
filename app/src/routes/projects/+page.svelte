<script lang="ts">
	import PageTagline from '$lib/components/PageTagline.svelte';
	import { buildSrcSet, defaultSizes } from '$lib/utils/image';
	import type { PageData } from './$types';

	export let data: PageData;
	const { projects } = data;

	const fallbackHero = {
		src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
		alt: 'Projectbeeld van Beau Robijn Fotografie'
	};

	const shareImage = projects[0]?.heroImage ?? fallbackHero;
</script>

<svelte:head>
	<title>Projectcases | Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Selectie van projectcases en behind-the-scenes verhalen van Beau Robijn Fotografie."
	/>
	<meta property="og:title" content="Projectcases | Beau Robijn Fotografie" />
	<meta
		property="og:description"
		content="Selectie van projectcases en behind-the-scenes verhalen van Beau Robijn Fotografie."
	/>
	<meta property="og:image" content={shareImage.src} />
	<meta property="og:image:alt" content={shareImage.alt} />
	<meta name="twitter:title" content="Projectcases | Beau Robijn Fotografie" />
	<meta
		name="twitter:description"
		content="Selectie van projectcases en behind-the-scenes verhalen van Beau Robijn Fotografie."
	/>
	<meta name="twitter:image" content={shareImage.src} />
	<meta name="twitter:image:alt" content={shareImage.alt} />
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="projects">
	<main class="flex flex-1 justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="flex w-full max-w-6xl flex-col gap-12 sm:gap-14">
			<header class="flex flex-col items-start gap-6">
				<PageTagline text="Case studies" />
				<h1 class="font-display text-[clamp(2.4rem,4vw+1.5rem,4.2rem)] uppercase leading-[1] text-neutral-900">
					Projectcases
				</h1>
				<p class="max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
					Een verdieping in projecten waar beeld, film en verhaal samenkomen. Klik door naar een case om
					het volledige proces, resultaat en eventuele behind-the-scenes video te ontdekken.
				</p>
			</header>

			{#if projects.length === 0}
				<p class="rounded-3xl border border-neutral-200 bg-white/90 p-6 text-sm text-neutral-500">
					Er zijn nog geen projectcases gepubliceerd. Voeg projecten toe via het beheerpaneel.
				</p>
			{:else}
				<section class="grid gap-6 md:grid-cols-2">
					{#each projects as project}
						{@const hero = project.heroImage ?? fallbackHero}
						<article class="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:border-rose-400/60 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
							<a href={`/projects/${project.slug}`} class="flex flex-col h-full">
								<div class="relative overflow-hidden">
									<img
										src={hero.src}
										srcset={buildSrcSet(hero.src)}
										sizes={defaultSizes}
										alt={hero.alt}
										class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
										loading="lazy"
										decoding="async"
									/>
									<span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"></span>
								</div>
								<div class="flex flex-1 flex-col gap-4 p-6">
									<div class="flex flex-col gap-2">
										<h2 class="font-display text-xl text-neutral-900">{project.title}</h2>
										{#if project.result}
											<p class="text-xs uppercase tracking-[0.3em] text-rose-600">{project.result}</p>
										{/if}
									</div>
									<p class="flex-1 text-sm leading-relaxed text-neutral-600">{project.description}</p>
									<div class="mt-2 inline-flex items-center gap-2 text-sm font-medium text-rose-700">
										Bekijk case
										<span aria-hidden="true">→</span>
									</div>
								</div>
							</a>
						</article>
					{/each}
				</section>
			{/if}
		</div>
	</main>
</div>
