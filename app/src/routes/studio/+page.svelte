<script lang="ts">
	import PageTagline from '$lib/components/PageTagline.svelte';
	import { buildSrcSet, defaultSizes } from '$lib/utils/image';
	import type { PageData } from './$types';

	export let data: PageData;
	const { studio } = data;
	const emailHref = `mailto:${studio.contactEmail}`;
	const contactHref = '/contact';
	const photos = studio.photos ?? [];
	const heroTagline = studio.tagline ?? 'Eigen studio';
	const photoShapes = ['sm:aspect-[4/5]', 'sm:aspect-square', 'sm:aspect-[5/6]'];
	const rubySrc = studio.rubyImage?.src?.trim() ?? '';
	const rubyIsSvg = rubySrc.toLowerCase().endsWith('.svg');

	const rubySrcSet =
		rubySrc && !rubySrc.startsWith('data:') && !rubyIsSvg
			? buildSrcSet(rubySrc, [320, 480, 640])
			: null;
	const rubySizes = '(min-width: 768px) 20vw, 40vw';
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

<div class="flex flex-1 flex-col bg-white" id="studio">
	<main class="flex flex-1 flex-col items-center px-4 pb-24 pt-14 sm:px-6 lg:pt-20">
		<div class="w-full max-w-6xl space-y-20">
			<section class="relative grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
				<div class="flex flex-col gap-8">
					<PageTagline text={heroTagline} />
					<h1 class="font-display text-[clamp(2.2rem,3.4vw+1.6rem,4rem)] uppercase leading-tight text-neutral-900">
						{studio.title}
					</h1>
					<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{studio.subtitle}</p>

						<div class="grid gap-4 sm:grid-cols-2">
							<article class="rounded-3xl border border-neutral-200/80 bg-white/90 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur">
								<p class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">
									{studio.address.label}
							</p>
							<div class="mt-3 space-y-2 text-sm text-neutral-700 sm:text-base">
								{#each studio.address.lines as line}
									<p>{line}</p>
								{/each}
							</div>
							{#if studio.address.mapUrl}
								<a
									class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-700 transition hover:text-rose-800"
									href={studio.address.mapUrl}
									target="_blank"
									rel="noreferrer"
								>
									Bekijk op kaart
									<span aria-hidden="true">↗</span>
								</a>
							{/if}
							</article>
							<article class="rounded-3xl border border-neutral-200/80 bg-white/90 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur sm:col-span-2 lg:col-span-1">
								<p class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">
									{studio.scheduleLabel}
								</p>
								<ul class="mt-3 space-y-2 text-sm text-neutral-700 sm:text-base">
									{#each studio.schedule as item}
										<li class="flex items-baseline justify-between gap-4 rounded-2xl border border-neutral-200/70 bg-white/95 px-5 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
											<span class="font-medium text-neutral-900">{item.day}</span>
											<span>{item.hours}</span>
										</li>
									{/each}
								</ul>
							{#if studio.scheduleNote}
								<p class="mt-3 text-sm text-neutral-500">{studio.scheduleNote}</p>
							{/if}
						</article>
					</div>
				</div>

				<figure class="relative flex justify-end">
					<div
						class="overflow-hidden rounded-[2.5rem] border border-neutral-200/80 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.16)]"
					>
						<img
							src={studio.portrait.src}
							srcset={buildSrcSet(studio.portrait.src)}
							sizes="(min-width: 1024px) 32vw, (min-width: 640px) 55vw, 80vw"
							alt={studio.portrait.alt}
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</figure>
			</section>

			{#if photos.length}
				<section class="space-y-6">
					<div class="flex flex-col gap-2">
						<p class="text-xs uppercase tracking-[0.32em] text-neutral-400">Kijk binnen</p>
						<h2 class="font-display text-[clamp(1.6rem,1.8vw+1.4rem,2.4rem)] uppercase text-neutral-900">
							De studio in beeld
						</h2>
					</div>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each photos as photo, index}
							<figure
								class={`group overflow-hidden rounded-[2.2rem] border border-neutral-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition ${photoShapes[index % photoShapes.length]}`}
							>
								<img
									src={photo.src}
									srcset={buildSrcSet(photo.src)}
									sizes={defaultSizes}
									alt={photo.alt}
									class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
									loading="lazy"
									decoding="async"
								/>
							</figure>
						{/each}
					</div>
				</section>
			{/if}

			<section class="rounded-[2.6rem] border border-rose-200/70 bg-rose-50/70 p-10 sm:p-12">
				<div class="space-y-6 md:max-w-3xl">
					<PageTagline text={studio.contactLabel} />
					<h2 class="font-display text-[clamp(1.8rem,2vw+1.3rem,2.6rem)] uppercase leading-tight text-rose-900">
						{studio.contactCtaHeading}
					</h2>
					<p class="text-base leading-relaxed text-rose-900/90 sm:text-lg">
						{studio.contactDescription}
					</p>
					<div class="flex flex-wrap gap-3">
						<a
							class="inline-flex w-full items-center justify-center rounded-full border border-rose-600 bg-rose-600 px-7 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto"
							href={contactHref}
						>
							{studio.contactPrimaryLabel}
						</a>
						<a
							class="inline-flex w-full items-center justify-center rounded-full border border-rose-100 bg-white/80 px-7 py-3 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:w-auto"
							href={emailHref}
						>
							Mail {studio.contactEmail}
						</a>
					</div>
				</div>
			</section>
		</div>
	</main>
</div>
