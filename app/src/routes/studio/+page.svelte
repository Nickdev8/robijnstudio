<script lang="ts">
	import PageTagline from '$lib/components/PageTagline.svelte';
import { buildSrcSet, defaultSizes } from '$lib/utils/image';
import type { PageData } from './$types';
import { fade } from 'svelte/transition';
import { onDestroy, onMount } from 'svelte';

type StudioPhoto = {
	src: string;
	alt?: string | null;
};

const isStudioPhoto = (value: unknown): value is StudioPhoto =>
	typeof value === 'object' &&
	value !== null &&
	typeof (value as { src?: unknown }).src === 'string';

const hashString = (value: string) => {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index);
		hash |= 0;
	}
	return hash >>> 0;
};

const deterministicShuffle = <T>(items: T[], seed: string) =>
	items
		.map((item, index) => {
			const identifier =
				typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item);
			const sortKey = hashString(`${seed}:${index}:${identifier}`);
			return { item, sortKey };
		})
		.sort((a, b) => a.sortKey - b.sortKey)
		.map(({ item }) => item);

export let data: PageData;
	const { studio } = data;
	const emailHref = `mailto:${studio.contactEmail}`;
	const contactHref = '/contact';
	const photos = Array.isArray(studio.photos) ? studio.photos.filter(isStudioPhoto) : [];
	const heroTagline = studio.tagline ?? 'Eigen studio';
	const photoShapes = ['sm:aspect-[4/5]', 'sm:aspect-square', 'sm:aspect-[5/6]'];
	const rubySrc = studio.rubyImage?.src?.trim() ?? '';
	const rubyIsSvg = rubySrc.toLowerCase().endsWith('.svg');
	const addressLines = Array.isArray(studio.address?.lines) ? studio.address.lines : [];
	const primaryAddressLine = addressLines[0] ?? studio.address.label;
	const secondaryAddressLines = addressLines.slice(1);
	const getDayBadge = (day: string) => day.trim().charAt(0).toUpperCase();

	const photoSeed = photos.map((photo) => photo.src).join('|');
	const shuffleSeedParts = [studio.title, studio.tagline, photoSeed || undefined].filter(Boolean);
	const shuffleSeed = shuffleSeedParts.join('|') || 'studio';
	const shuffledPhotos = deterministicShuffle(photos, shuffleSeed);

	const getPhotoShapeClass = (photo: StudioPhoto, index: number) => {
		const hashedIndex = hashString(`${shuffleSeed}:${index}:${photo.src}`);
		return photoShapes[hashedIndex % photoShapes.length];
	};

	const rubySrcSet =
		rubySrc && !rubySrc.startsWith('data:') && !rubyIsSvg
			? buildSrcSet(rubySrc, [320, 480, 640])
			: null;
	const rubySizes = '(min-width: 768px) 20vw, 40vw';
	const heroSlides = [studio.portrait, ...shuffledPhotos].filter(
		(slide, index, array) =>
			slide &&
			typeof slide.src === 'string' &&
			array.findIndex((item) => item?.src === slide.src) === index
	);
	let heroIndex = 0;
	let carouselInterval: ReturnType<typeof setInterval> | undefined;
	$: currentHero = heroSlides[heroIndex] ?? studio.portrait;
	const hasHeroCarousel = heroSlides.length > 1;
	const goToHeroSlide = (index: number) => {
		if (!heroSlides.length) return;
		const total = heroSlides.length;
		const nextIndex = (index + total) % total;
		heroIndex = nextIndex;
		if (hasHeroCarousel) {
		stopCarousel();
		startCarousel();
	}
};
	const nextHeroSlide = () => goToHeroSlide(heroIndex + 1);
	const prevHeroSlide = () => goToHeroSlide(heroIndex - 1);

	const startCarousel = () => {
		if (!hasHeroCarousel) return;
		stopCarousel();
		carouselInterval = setInterval(() => {
			nextHeroSlide();
		}, 6000);
	};

	const stopCarousel = () => {
		if (carouselInterval) {
			clearInterval(carouselInterval);
			carouselInterval = undefined;
		}
	};

	onMount(startCarousel);
	onDestroy(stopCarousel);
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
					<div>
						<h1 class="font-display text-[clamp(2.2rem,3.4vw+1.6rem,4rem)] uppercase leading-tight text-neutral-900">
							{studio.title}
						</h1>
						<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{studio.subtitle}</p>
					</div>
					<div class="mt-6">
						<article class="rounded-[2.4rem] border border-rose-200/70 bg-rose-50/70 p-8 shadow-[0_24px_60px_rgba(190,24,93,0.18)] sm:p-10">
							<div class="flex flex-col gap-4">
								<p class="font-lifted text-[0.65rem] uppercase tracking-[0.38em] text-rose-500">
									{studio.address.label}
								</p>
								<h2 class="font-display text-[clamp(1.6rem,2vw+1.2rem,2.4rem)] uppercase leading-tight text-rose-900">
									{primaryAddressLine}
								</h2>
								{#if secondaryAddressLines.length}
									<div class="space-y-2 text-sm leading-relaxed text-rose-900/80 sm:text-base">
										{#each secondaryAddressLines as line}
											<p>{line}</p>
										{/each}
									</div>
								{/if}
								{#if studio.address.mapUrl}
									<a
										class="mt-4 inline-flex w-full items-center justify-between rounded-full border border-rose-300 bg-white/80 px-6 py-3 text-sm font-medium text-rose-600 transition hover:border-rose-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 sm:w-auto"
										href={studio.address.mapUrl}
										target="_blank"
										rel="noreferrer"
									>
										Route bekijken
										<span aria-hidden="true">↗</span>
									</a>
								{/if}
							</div>
						</article>
					</div>
				</div>
				
				<figure class="relative flex justify-end">
					<div
						class="relative aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-[2.5rem] border border-neutral-200/80 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.16)]"
						role="group"
						aria-roledescription="carousel"
						aria-label="Studio beelden"
					>
						{#if currentHero}
							{#key currentHero.src}
								<img
									src={currentHero.src}
									srcset={buildSrcSet(currentHero.src)}
									sizes="(min-width: 1024px) 32vw, (min-width: 640px) 55vw, 80vw"
									alt={currentHero.alt ?? studio.portrait.alt}
									class="h-full w-full object-cover object-center md:object-top"
									loading="lazy"
									decoding="async"
									in:fade={{ duration: 450 }}
									out:fade={{ duration: 300 }}
								/>
							{/key}
						{/if}
						{#if hasHeroCarousel}
							<div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
							<div class="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
								{#each heroSlides as slide, index}
									<button
										type="button"
										class={`h-2 w-8 rounded-full transition ${index === heroIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
										class:opacity-40={index !== heroIndex}
										on:click={() => goToHeroSlide(index)}
										aria-label={`Toon afbeelding ${index + 1}`}
										aria-current={index === heroIndex}
									></button>
								{/each}
							</div>
							<div class="absolute inset-y-0 left-0 flex items-center">
								<button
									type="button"
									class="m-4 hidden h-12 w-12 items-center justify-center rounded-full bg-rose-600/85 text-white shadow-[0_16px_40px_rgba(190,24,93,0.35)] transition hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:flex"
									on:click={prevHeroSlide}
									aria-label="Vorige afbeelding"
									on:mouseenter={stopCarousel}
									on:mouseleave={startCarousel}
								>
									<span aria-hidden="true" class="text-lg font-semibold leading-none">‹</span>
								</button>
							</div>
							<div class="absolute inset-y-0 right-0 flex items-center">
								<button
									type="button"
									class="m-4 hidden h-12 w-12 items-center justify-center rounded-full bg-rose-600/85 text-white shadow-[0_16px_40px_rgba(190,24,93,0.35)] transition hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:flex"
									on:click={nextHeroSlide}
									aria-label="Volgende afbeelding"
									on:mouseenter={stopCarousel}
									on:mouseleave={startCarousel}
								>
									<span aria-hidden="true" class="text-lg font-semibold leading-none">›</span>
								</button>
							</div>
						{/if}
					</div>
				</figure>
			</section>

			<section class="rounded-[3rem] border border-neutral-200/70 bg-white/95 p-8 shadow-[0_28px_80px_rgba(15,23,42,0.18)] sm:p-10">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div class="space-y-2">
						<p class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">
							{studio.scheduleLabel}
						</p>
						{#if studio.scheduleIntro}
							<p class="max-w-sm text-sm text-neutral-500 sm:text-base">
								{studio.scheduleIntro}
							</p>
						{/if}
					</div>
					{#if studio.scheduleNote}
						<p class="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-neutral-500">
							{studio.scheduleNote}
						</p>
					{/if}
				</div>
				<ol class="relative mt-6 space-y-4 before:absolute before:left-[1.15rem] before:top-4 before:bottom-4 before:w-px before:bg-neutral-200/60 before:content-['']">
					{#each studio.schedule as item}
						<li class="relative pl-14">
							<span
								class="absolute left-6 top-[1.8rem] h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_0_6px_rgba(244,114,182,0.16)]"
								aria-hidden="true"
							></span>
							<div class="rounded-2xl border border-neutral-200/70 bg-white/95 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
								<div class="flex items-center justify-between gap-4">
									<span class="text-xs uppercase tracking-[0.32em] text-neutral-400">{item.day}</span>
									<span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-rose-600">
										{getDayBadge(item.day)}
									</span>
								</div>
								<p class="mt-3 text-lg font-semibold text-neutral-900 sm:text-xl">{item.hours}</p>
							</div>
						</li>
					{/each}
				</ol>
			</section>

			{#if shuffledPhotos.length}
				<section class="space-y-6">
					<div class="flex flex-col gap-2">
						<p class="text-xs uppercase tracking-[0.32em] text-neutral-400">Kijk binnen</p>
						<h2 class="font-display text-[clamp(1.6rem,1.8vw+1.4rem,2.4rem)] uppercase text-neutral-900">
							De studio in beeld
						</h2>
					</div>
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each shuffledPhotos as photo, index}
							<figure
								class={`group overflow-hidden rounded-[2.2rem] border border-neutral-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition ${getPhotoShapeClass(photo, index)}`}
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
