<script lang="ts">
import PageTagline from '$lib/components/PageTagline.svelte';
import { buildSrcSet, defaultSizes } from '$lib/utils/image';
import type { PageData } from './$types';

export let data: PageData;
const { home } = data;
</script>

<svelte:head>
	<title>Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Portfolio van Beau Robijn Fotografie — fotografische verhalen met een filmische signatuur."
	/>
	<meta property="og:title" content="Beau Robijn Fotografie" />
	<meta property="og:description" content={home.description} />
	<meta property="og:image" content={home.heroImage.src} />
	<meta property="og:image:alt" content={home.heroImage.alt} />
	<meta name="twitter:title" content="Beau Robijn Fotografie" />
	<meta name="twitter:description" content={home.description} />
	<meta name="twitter:image" content={home.heroImage.src} />
	<meta name="twitter:image:alt" content={home.heroImage.alt} />
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="home">
	<main class="flex flex-1 flex-col items-center px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
		<section class="w-full max-w-6xl">
			<div class="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
				<div class="flex flex-col gap-8 lg:order-2">
					<PageTagline text={home.tagline} />
					<h1 class="font-display text-[clamp(2.6rem,4vw+1.6rem,4.6rem)] uppercase leading-[0.96] text-neutral-900">
						<span class="block">{home.title}</span>
						<span class="mt-1 block text-[clamp(1.4rem,2vw+1rem,2.4rem)] text-neutral-400">{home.subtitle}</span>
					</h1>
					<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{home.description}</p>
					<p class="rounded-2xl border border-neutral-200/70 bg-white px-5 py-4 text-sm text-neutral-500">
						<span class="font-display block text-xs uppercase tracking-[0.32em] text-neutral-400">Beschikbaarheid</span>
						<span class="mt-2 block text-neutral-600">{home.availability}</span>
					</p>

					<div class="flex flex-wrap gap-3">
						<a
							href="/portfolio"
							class="font-display inline-flex w-full items-center justify-center gap-3 rounded-full border border-neutral-900/10 bg-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 sm:w-auto"
						>
							<span class="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
							Bekijk portfolio
						</a>
						<a
							href="/about"
							class="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-6 transition hover:text-neutral-900 hover:decoration-neutral-500 sm:w-auto sm:justify-start"
						>
							Leer Beau kennen
						</a>
					</div>
				</div>

				<figure class="lg:order-1">
					<div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition duration-500 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
						<img
							src={home.heroImage.src}
							srcset={buildSrcSet(home.heroImage.src)}
							sizes={defaultSizes}
							alt={home.heroImage.alt}
							class="h-full w-full object-cover object-center sm:aspect-[4/5]"
							loading="eager"
							decoding="async"
							fetchpriority="high"
						/>
					</div>
					<figcaption class="mt-4 text-xs uppercase tracking-[0.38em] text-neutral-400">
						{home.heroImage.alt}
					</figcaption>
				</figure>
			</div>
		</section>

		</main>
	</div>
