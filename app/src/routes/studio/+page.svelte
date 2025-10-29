<script lang="ts">
import { buildSrcSet, defaultSizes } from '$lib/utils/image';
import type { PageData } from './$types';

export let data: PageData;
const { studio } = data;
const emailHref = `mailto:${studio.contactEmail}`;
const rubySrcSet = studio.rubyImage.src.startsWith('data:')
	? null
	: buildSrcSet(studio.rubyImage.src, [320, 480, 640]);
const rubySizes = '(min-width: 1024px) 15vw, 40vw';
const studioPhotos = studio.photos.slice(0, 2);
</script>

<svelte:head>
	<title>{studio.title}</title>
	<meta name="description" content={studio.subtitle} />
	<meta property="og:title" content={studio.title} />
	<meta property="og:description" content={studio.subtitle} />
	<meta property="og:image" content={studio.portrait.src} />
	<meta property="og:image:alt" content={studio.portrait.alt} />
	<meta name="twitter:title" content={studio.title} />
	<meta name="twitter:description" content={studio.subtitle} />
	<meta name="twitter:image" content={studio.portrait.src} />
	<meta name="twitter:image:alt" content={studio.portrait.alt} />
</svelte:head>

<div class="flex flex-1 flex-col bg-gradient-to-b from-neutral-100 via-white to-neutral-100/60" id="studio">
	<main class="relative flex flex-1 justify-center px-4 pb-20 pt-16 sm:px-6 lg:pt-20">
		<div class="relative w-full max-w-6xl">
			<div class="pointer-events-none absolute -top-24 left-6 h-52 w-52 rounded-full bg-gradient-to-br from-rose-100/80 via-white to-transparent blur-3xl"></div>
			<div class="pointer-events-none absolute -top-10 right-32 hidden h-48 w-48 rounded-full bg-gradient-to-tr from-rose-200/70 via-transparent to-transparent blur-3xl lg:block"></div>
			{#if studio.rubyImage?.src}
				<div class="pointer-events-none absolute -top-16 right-0 hidden lg:block">
					<img
						src={studio.rubyImage.src}
						srcset={rubySrcSet ?? undefined}
						sizes={rubySrcSet ? rubySizes : undefined}
						alt={studio.rubyImage.alt}
						class="w-40 origin-top-right"
						loading="lazy"
						decoding="async"
					/>
				</div>
			{/if}

			<section class="flex flex-col items-center text-center">
				<h1 class="font-display text-[clamp(2.4rem,3.1vw+1.8rem,3.8rem)] uppercase leading-tight tracking-[0.1em] text-neutral-900">
					{studio.title}
				</h1>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
					{studio.subtitle}
				</p>
				<div class="mt-6 h-px w-24 bg-gradient-to-r from-rose-400 to-rose-200"></div>
			</section>

			<section class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-14">
				<div class="grid gap-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
					{#each studioPhotos as photo, index}
						<figure
							class={`overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/80 backdrop-blur ${index === 0
								? 'sm:translate-y-6 lg:translate-y-0'
								: 'sm:-translate-y-6 lg:-translate-y-3'}`}
						>
							<img
								src={photo.src}
								srcset={buildSrcSet(photo.src)}
								sizes={defaultSizes}
								alt={photo.alt}
								class="h-full w-full object-cover"
								loading="lazy"
								decoding="async"
							/>
						</figure>
					{/each}
				</div>

					<div class="flex flex-col gap-6">
						<article class="rounded-3xl border border-neutral-200/80 bg-white/80 p-8 backdrop-blur">
							<p class="font-lifted text-[0.7rem] uppercase tracking-[0.32em] text-neutral-400">
								{studio.address.label}
							</p>
							<div class="mt-3 space-y-2 text-left text-base leading-relaxed text-neutral-700 sm:text-lg">
								{#each studio.address.lines as line}
									<p>{line}</p>
							{/each}
						</div>
						{#if studio.address.mapUrl}
							<div class="mt-4">
								<a
									class="inline-flex items-center gap-2 text-sm font-medium text-rose-700 transition hover:text-rose-800"
									href={studio.address.mapUrl}
									target="_blank"
									rel="noreferrer"
								>
									Bekijk op kaart
									<span aria-hidden="true">↗</span>
								</a>
							</div>
							{/if}
						</article>

						<article class="rounded-3xl border border-rose-200/70 bg-rose-50/80 p-8 text-left backdrop-blur">
							<p class="font-lifted text-[0.7rem] uppercase tracking-[0.32em] text-rose-500">
								{studio.contactLabel}
							</p>
							<p class="mt-3 text-base leading-relaxed text-rose-900 sm:text-lg">
								{studio.contactDescription}
							</p>
						<a
							class="mt-6 inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
							href={emailHref}
						>
								{studio.contactEmail}
							</a>
						</article>

						<article class="rounded-3xl border border-neutral-200/80 bg-white/80 p-8 backdrop-blur">
							<p class="font-lifted text-[0.7rem] uppercase tracking-[0.32em] text-neutral-400">
								{studio.scheduleLabel}
							</p>
							<ul class="mt-4 space-y-3 text-sm text-neutral-700 sm:text-base">
								{#each studio.schedule as item}
									<li class="flex items-baseline justify-between gap-4 rounded-2xl border border-neutral-200/70 bg-neutral-50/80 px-4 py-3">
										<span class="font-medium text-neutral-900">{item.day}</span>
										<span>{item.hours}</span>
									</li>
								{/each}
							</ul>
						{#if studio.scheduleNote}
							<p class="mt-4 text-sm text-neutral-500">{studio.scheduleNote}</p>
						{/if}
					</article>
					</div>

					<div class="flex items-start justify-center">
						<div
							class="overflow-hidden rounded-[2.6rem] border border-rose-200/70 bg-white/80 backdrop-blur"
						>
							<img
								src={studio.portrait.src}
								srcset={buildSrcSet(studio.portrait.src)}
								sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 80vw"
							alt={studio.portrait.alt}
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</div>
			</section>
		</div>
	</main>
</div>
