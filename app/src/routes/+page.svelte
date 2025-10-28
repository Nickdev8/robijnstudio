<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { home } = data;
</script>

<svelte:head>
	<title>Beau Robijn Studios</title>
	<meta
		name="description"
		content="Portfolio van Beau Robijn Studios — fotografische verhalen met een filmische signatuur."
	/>
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="home">
	<Header />

	<main class="flex flex-1 items-center justify-center px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
		<div class="grid w-full max-w-6xl items-start gap-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
			<figure class="relative">
				<div
					class="relative overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-200/40 shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:rounded-[3rem]"
				>
					<img
						src={home.heroImage.src}
						alt={home.heroImage.alt}
						class="h-full w-full object-cover object-center sm:aspect-[4/5]"
						loading="lazy"
						decoding="async"
					/>
					<div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"></div>
					<span
						class="font-lifted absolute left-8 bottom-8 text-[0.65rem] uppercase tracking-[0.5em] text-white/80"
					>
						{home.heroLabel}
					</span>
				</div>
				<figcaption class="mt-4 font-lifted text-[0.65rem] uppercase tracking-[0.5em] text-neutral-400">
					{home.heroImage.alt}
				</figcaption>
			</figure>

			<div class="flex flex-col items-start gap-10">
				<span class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[0.7rem] uppercase tracking-[0.32em] text-neutral-500 sm:text-xs sm:tracking-[0.36em]">
					<span class="h-2 w-2 rounded-full bg-neutral-900"></span>
					{home.tagline}
				</span>
				<h1
					class="font-display text-[clamp(2.6rem,5vw+2rem,5.8rem)] uppercase leading-[0.95] text-neutral-900"
				>
					<span class="block">{home.title}</span>
					<span class="block text-[clamp(2rem,3vw+1rem,3.6rem)] text-neutral-400">{home.subtitle}</span>
				</h1>
				<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
					{home.description}
				</p>

				<div class="w-full max-w-xl space-y-6">
					<p class="font-display text-lg text-neutral-900">Bekijk mijn werk</p>
					<div class="space-y-4">
						{#each home.cta as item}
							<a
								href={item.href}
								class="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-5 py-4 transition-all hover:border-neutral-900 hover:bg-white sm:px-6 sm:py-5"
							>
								<div>
									<span class="font-display text-lg text-neutral-900 sm:text-xl">{item.title}</span>
									<span class="mt-1 block text-sm text-neutral-500">
										{item.description}
									</span>
								</div>
								<span
									class="ml-auto hidden text-2xl text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900 sm:block"
									>→</span
								>
							</a>
						{/each}
					</div>
				</div>

				<p class="text-sm text-neutral-500">
					{home.availability}
				</p>
			</div>
		</div>
	</main>
</div>
