<script lang="ts">
import Lightbox, { type LightboxImage } from '$lib/components/Lightbox.svelte';
import PageTagline from '$lib/components/PageTagline.svelte';
import { buildSrcSet } from '$lib/utils/image';
import { writable } from 'svelte/store';
import type { PageData } from './$types';
import type { GalleryItem } from '$lib/types/content';

export let data: PageData;
const { portfolio } = data;
const selected = writable<LightboxImage | null>(null);
const sizePriority: Record<GalleryItem['size'], number> = { wide: 0, tall: 1, square: 2 };
const galleryItems = [...(portfolio.gallery ?? [])].sort(
	(a, b) => (sizePriority[a.size] ?? 2) - (sizePriority[b.size] ?? 2)
);
const gallerySizes = '(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 92vw';
const shareImage =
	galleryItems?.[0] ??
	({
		src: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1600&q=80',
		alt: 'Editorial shoot in het gouden uur'
	} as LightboxImage);

const openLightbox = (image: LightboxImage) => {
	// selected.set(image);
};

const closeLightbox = () => {
	// selected.set(null);
};
</script>

<svelte:head>
	<title>Portfolio | Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Portfolio overzicht van Beau Robijn Fotografie. Responsieve grid met portretten en documentaire beelden."
	/>
	<meta property="og:title" content="Portfolio | Beau Robijn Fotografie" />
	<meta
		property="og:description"
		content="Portfolio overzicht van Beau Robijn Fotografie. Responsieve grid met portretten en documentaire beelden."
	/>
	<meta property="og:image" content={shareImage.src} />
	<meta property="og:image:alt" content={shareImage.alt} />
	<meta name="twitter:title" content="Portfolio | Beau Robijn Fotografie" />
	<meta
		name="twitter:description"
		content="Portfolio overzicht van Beau Robijn Fotografie. Responsieve grid met portretten en documentaire beelden."
	/>
	<meta name="twitter:image" content={shareImage.src} />
	<meta name="twitter:image:alt" content={shareImage.alt} />
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="portfolio">
	<main class="flex flex-1 justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="flex w-full max-w-6xl flex-col gap-10 sm:gap-12">
			<header class="flex flex-col items-start gap-6">
				<PageTagline text={portfolio.tagline} />
				<h1 class="font-display text-[clamp(2.4rem,4vw+1.5rem,4.2rem)] uppercase leading-[1] text-neutral-900">
					Portfolio
				</h1>
				<p class="max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
					{portfolio.description}
				</p>
			</header>

			<section class="grid auto-rows-[12rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[18rem] lg:grid-cols-4 lg:gap-5" aria-label="Galerij met portfolio beelden">
				{#each galleryItems as image, index}
					<button
						type="button"
						class={`group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/60 transition-shadow hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(190,18,60,0.18)] ${
							image.size === 'wide'
								? 'col-span-2 sm:col-span-2 lg:col-span-2'
								: image.size === 'tall'
								? 'row-span-2 sm:row-span-2 lg:row-span-2'
								: ''
						}`}
						onclick={() => openLightbox({ src: image.src, alt: image.alt })}
					>
						<img
							src={image.src}
							srcset={buildSrcSet(image.src)}
							sizes={gallerySizes}
							alt={image.alt}
							loading={index < 3 ? 'eager' : 'lazy'}
							decoding="async"
							class={`h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02] ${
								image.size === 'wide'
									? 'aspect-[3/2]'
									: image.size === 'tall'
									? 'aspect-[3/4] sm:aspect-auto'
									: 'aspect-square sm:aspect-auto'
							}`}
						/>
						<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
						<div class="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-3 px-5 pb-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
							<p class="text-xs font-medium uppercase tracking-[0.24em] text-rose-100 sm:text-sm">
								{image.alt}
							</p>
						</div>
					</button>
				{/each}
			</section>
		</div>
	</main>

	<Lightbox image={$selected} onClose={closeLightbox} />
</div>
