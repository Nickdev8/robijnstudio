<script lang="ts">
import Lightbox, { type LightboxImage } from '$lib/components/Lightbox.svelte';
import PageTagline from '$lib/components/PageTagline.svelte';
import { buildSrcSet } from '$lib/utils/image';
import { writable } from 'svelte/store';
import type { PageData } from './$types';

export let data: PageData;
const { portfolio } = data;
	const selected = writable<LightboxImage | null>(null);
	const gallerySizes = '(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw';

	const openLightbox = (image: LightboxImage) => {
		selected.set(image);
	};

	const closeLightbox = () => {
		selected.set(null);
	};
</script>

<svelte:head>
	<title>Portfolio | Beau Robijn Fotografie</title>
	<meta name="description" content="Portfolio overzicht van Beau Robijn Fotografie. Responsieve grid met portretten en documentaire beelden." />
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

			<section
				class="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-6"
				aria-label="Galerij met portfolio beelden"
			>
				{#each portfolio.gallery as image, index}
					<button
						type="button"
						class={`group relative overflow-hidden rounded-[1.8rem] border border-neutral-200 bg-neutral-100 transition-colors hover:border-rose-500 sm:rounded-[2.5rem] ${
							image.size === 'wide' ? 'sm:col-span-2 lg:col-span-2' : ''
						} ${image.size === 'tall' ? 'lg:row-span-2' : ''}`}
						onclick={() => openLightbox({ src: image.src, alt: image.alt })}
					>
						<img
							src={image.src}
							srcset={buildSrcSet(image.src)}
							sizes={gallerySizes}
							alt={image.alt}
							loading={index < 3 ? 'eager' : 'lazy'}
							decoding="async"
							class={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
								image.size === 'wide' ? 'aspect-[3/2]' : image.size === 'tall' ? 'aspect-[3/4]' : 'aspect-square'
							}`}
						/>
						<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
						<div class="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-3 px-6 pb-6 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
							<p class="text-sm font-medium text-rose-100">{image.alt}</p>
						</div>
					</button>
				{/each}
			</section>
		</div>
	</main>

	<Lightbox image={$selected} onClose={closeLightbox} />
</div>
