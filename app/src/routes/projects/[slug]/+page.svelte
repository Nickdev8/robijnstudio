<script lang="ts">
	import PageTagline from '$lib/components/PageTagline.svelte';
	import { buildSrcSet, defaultSizes } from '$lib/utils/image';
	import type { PageData } from './$types';

	export let data: PageData;
	const { project } = data;
	const shareImage = project.heroImage;
	const bodyParagraphs = project.body.filter((paragraph) => paragraph.trim().length > 0);
</script>

<svelte:head>
	<title>{project.title} | Cases | Beau Robijn Fotografie</title>
	<meta name="description" content={project.description} />
	<meta property="og:title" content={`${project.title} | Cases | Beau Robijn Fotografie`} />
	<meta property="og:description" content={project.description} />
	<meta property="og:image" content={shareImage.src} />
	<meta property="og:image:alt" content={shareImage.alt} />
	<meta name="twitter:title" content={`${project.title} | Cases | Beau Robijn Fotografie`} />
	<meta name="twitter:description" content={project.description} />
	<meta name="twitter:image" content={shareImage.src} />
	<meta name="twitter:image:alt" content={shareImage.alt} />
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="project-detail">
	<main class="flex flex-1 justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="flex w-full max-w-5xl flex-col gap-12">
			<header class="flex flex-col gap-6">
				<PageTagline text="Case study" />
				<h1 class="font-display text-[clamp(2.4rem,3.4vw+1.6rem,4rem)] uppercase leading-[1] text-neutral-900">
					{project.title}
				</h1>
				<p class="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
					{project.description}
				</p>
				<div class="flex flex-wrap gap-3 text-sm text-neutral-600">
					<a
						href="/portfolio"
						class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 transition hover:border-rose-400 hover:text-rose-700"
					>
						<span aria-hidden="true">←</span>
						Terug naar portfolio
					</a>
					{#if project.externalUrl}
						<a
							href={project.externalUrl}
							target="_blank"
							rel="noreferrer"
							class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 transition hover:border-neutral-900"
						>
							Bekijk volledige case
							<span aria-hidden="true">↗</span>
						</a>
					{/if}
				</div>
			</header>

			<section class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-50/60 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
				<img
					src={shareImage.src}
					srcset={buildSrcSet(shareImage.src)}
					sizes={defaultSizes}
					alt={shareImage.alt}
					class="h-full w-full object-cover"
					loading="eager"
					decoding="async"
				/>
			</section>

			<section class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
				<div class="space-y-6">
					{#each bodyParagraphs as paragraph}
						<p class="text-base leading-relaxed text-neutral-600 sm:text-lg">{paragraph}</p>
					{/each}
				</div>

				<div class="space-y-6">
					{#if project.videoUrl}
						<div class="space-y-3">
							<p class="font-display text-sm uppercase tracking-[0.3em] text-neutral-500">Behind the scenes</p>
							<div class="overflow-hidden rounded-3xl border border-neutral-200">
								<iframe
									src={project.videoUrl}
									title={`Video ${project.title}`}
									loading="lazy"
									referrerpolicy="no-referrer"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowfullscreen
									class="aspect-video w-full"
								></iframe>
							</div>
						</div>
					{/if}
					{#if project.result}
						<div class="rounded-3xl border border-neutral-200 bg-white/95 p-6 text-sm text-neutral-600 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
							<p class="font-display text-base text-neutral-900">Resultaat</p>
							<p class="mt-2 leading-relaxed">{project.result}</p>
						</div>
					{/if}
				</div>
			</section>
		</div>
	</main>
</div>
