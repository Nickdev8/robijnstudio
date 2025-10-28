<script lang="ts">
	import Header from '$lib/components/Header.svelte';
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

	<main class="flex flex-1 items-center justify-center px-6 pb-16 pt-12">
		<div class="grid w-full max-w-6xl items-start gap-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
			<figure class="relative">
				<div
					class="relative overflow-hidden rounded-[3rem] border border-neutral-200 bg-neutral-200/40 shadow-[0_35px_90px_rgba(15,23,42,0.18)]"
				>
					<img
						src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=80"
						alt="Zwart-wit portret vastgelegd door Beau Robijn Studios"
						class="h-full w-full object-cover object-center sm:aspect-[4/5]"
						loading="lazy"
						decoding="async"
					/>
					<div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"></div>
					<span
						class="font-lifted absolute left-8 bottom-8 text-[0.65rem] uppercase tracking-[0.5em] text-white/80"
					>
						Portretserie
					</span>
				</div>
				<figcaption class="mt-4 font-lifted text-[0.65rem] uppercase tracking-[0.5em] text-neutral-400">
					Intieme momenten in zwart-wit
				</figcaption>
			</figure>

			<div class="flex flex-col items-start gap-10">
				<div class="font-lifted text-xs uppercase text-neutral-500">Amsterdam · Tijdloze fotografie</div>
				<h1
					class="font-display text-[clamp(3.4rem,5vw+2rem,5.8rem)] uppercase leading-[0.92] text-neutral-900"
				>
					<span class="block">Beau Robijn</span>
					<span class="block text-[clamp(2.4rem,2.4vw+1.1rem,3.6rem)] text-neutral-400">Studios</span>
				</h1>
				<p class="max-w-md text-base leading-relaxed text-neutral-600">
					Ik documenteer stille kracht en kwetsbaarheid in beeld, met aandacht voor textuur, natuurlijke lichtval en
					een cinema-achtige gelaagdheid.
				</p>

				<div class="w-full max-w-md space-y-6">
					<div class="font-lifted text-xs uppercase text-neutral-500">Bekijk mijn werk</div>
					<div class="space-y-4">
						<a
							href="/portfolio"
							class="group flex items-start justify-between gap-4 border-b border-neutral-200 pb-4 transition-colors hover:border-neutral-900"
						>
							<div>
								<span class="font-display text-xl text-neutral-900">Portfolio</span>
								<span class="mt-1 block text-sm text-neutral-500">Recente opdrachten en autonome projecten</span>
							</div>
							<span
								class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
								>→</span
							>
						</a>

						<a
							href="/featured-series"
							class="group flex items-start justify-between gap-4 border-b border-neutral-200 pb-4 transition-colors hover:border-neutral-900"
						>
							<div>
								<span class="font-display text-xl text-neutral-900">Uitgelichte series</span>
								<span class="mt-1 block text-sm text-neutral-500">Langlopende vertellingen vol sfeer</span>
							</div>
							<span
								class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
								>→</span
							>
						</a>
					</div>
				</div>

				<div class="font-lifted text-xs uppercase text-neutral-400">
					Beschikbaar voor redactionele en commerciële shoots wereldwijd
				</div>
			</div>
		</div>
	</main>
</div>
