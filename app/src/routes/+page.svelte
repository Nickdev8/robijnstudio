<script lang="ts">
		import type { PageData } from './$types';

	export let data: PageData;
	const { home } = data;
	const primaryCTA = home.cta?.[0];
	const secondaryCTA = home.cta?.[1];
</script>

<svelte:head>
	<title>Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Portfolio van Beau Robijn Studios — fotografische verhalen met een filmische signatuur."
	/>
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="home">
	<main class="flex flex-1 flex-col items-center px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
		<section class="w-full max-w-6xl">
			<div class="grid items-center gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
				<div class="flex flex-col gap-8 md:order-2">
					<div class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[0.7rem] uppercase tracking-[0.32em] text-neutral-500 sm:text-xs sm:tracking-[0.36em]">
						<img src="/ruby.png" alt="" aria-hidden="true" class="h-4 w-4 object-contain" />
						{home.tagline}
					</div>
					<h1 class="font-display text-[clamp(2.6rem,4vw+1.6rem,4.6rem)] uppercase leading-[0.96] text-neutral-900">
						<span class="block">{home.title}</span>
						<span class="mt-1 block text-[clamp(1.4rem,2vw+1rem,2.4rem)] text-neutral-400">{home.subtitle}</span>
					</h1>
					<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">{home.description}</p>

					<div class="grid gap-4 text-sm text-neutral-500 sm:grid-cols-2">
						<div class="rounded-2xl border border-neutral-200/70 bg-white px-5 py-4">
							<p class="font-display text-xs uppercase tracking-[0.32em] text-neutral-400">Focus</p>
							<p class="mt-2 font-medium text-neutral-900">{primaryCTA?.title ?? 'Authentieke verhalen'}</p>
							<p class="text-neutral-500">{primaryCTA?.description ?? 'Filmische fotografie met ruimte voor kwetsbaarheid.'}</p>
						</div>
						<div class="rounded-2xl border border-neutral-200/70 bg-white px-5 py-4">
							<p class="font-display text-xs uppercase tracking-[0.32em] text-neutral-400">Beschikbaarheid</p>
							<p class="mt-2 text-neutral-600">{home.availability}</p>
						</div>
					</div>

					<div class="flex flex-wrap gap-3">
						<a
							href="/portfolio"
							class="font-display inline-flex items-center justify-center gap-3 rounded-full border border-neutral-900/10 bg-neutral-900 px-7 py-3 text-xs uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
						>
							<span class="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
							Bekijk portfolio
						</a>
						<a
							href="/about"
							class="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-6 transition hover:text-neutral-900 hover:decoration-neutral-500"
						>
							Leer Beau kennen
						</a>
					</div>
				</div>

				<figure class="md:order-1">
					<div class="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)] transition duration-500 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
						<img
							src={home.heroImage.src}
							alt={home.heroImage.alt}
							class="h-full w-full object-cover object-center sm:aspect-[4/5]"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-4 text-xs uppercase tracking-[0.38em] text-neutral-400">
						{home.heroImage.alt}
					</figcaption>
				</figure>
			</div>
		</section>

		<section class="mt-16 w-full">
			<div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
				{#if home.cta?.length}
					<ul class="grid gap-4 rounded-[2rem] border border-neutral-200 bg-white px-6 py-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)] list-none sm:grid-cols-2 sm:px-10 sm:py-10">
						{#each home.cta as item}
							<li class="rounded-2xl border border-neutral-200 px-5 py-4 text-sm text-neutral-600 transition hover:border-neutral-300">
								<p class="font-medium text-neutral-900">{item.title}</p>
								<p class="text-neutral-500">{item.description}</p>
							</li>
						{/each}
					</ul>
				{/if}
				{#if secondaryCTA}
					<div class="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.36em] text-neutral-400">
						<span class="inline-flex h-2 w-2 flex-none rounded-full bg-neutral-300"></span>
						<span class="text-neutral-500">{secondaryCTA.title}</span>
						<span>·</span>
						<span class="text-neutral-400">{secondaryCTA.description}</span>
					</div>
				{/if}
			</div>
		</section>
	</main>
</div>
