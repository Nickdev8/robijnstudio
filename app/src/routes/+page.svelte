<script lang="ts">
	const navItems = [
		{ href: '#home', label: 'Home' },
		{ href: '#about', label: 'Over' },
		{ href: '#portfolio', label: 'Portfolio' },
		{ href: '#contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<title>Beau Robijn Studios</title>
	<meta
		name="description"
		content="Portfolio van Beau Robijn Studios — fotografische verhalen met een filmische signatuur."
	/>
</svelte:head>

<div class="min-h-screen bg-white text-neutral-900" id="home">
	<header class="flex flex-col items-center gap-6 px-6 pt-12">
		<img
			src="/logo.svg"
			alt="Logo van Beau Robijn Studios"
			class="h-24 w-24"
			loading="lazy"
			decoding="async"
		/>

		<nav class="font-lifted flex flex-wrap items-center justify-center gap-10 text-xs uppercase text-neutral-600">
			{#each navItems as nav}
				<a href={nav.href} class="relative pb-2 transition-colors duration-200 hover:text-black">
					{nav.label}
					<span
						class="pointer-events-none absolute inset-x-0 -bottom-0.5 hidden h-px bg-neutral-800 sm:block"
					></span>
				</a>
			{/each}
		</nav>
	</header>

	<main class="flex flex-1 items-center justify-center px-6 pb-16 pt-12">
		<div class="grid w-full max-w-5xl items-center gap-12 md:grid-cols-[1.05fr_minmax(0,0.95fr)] md:gap-20">
			<div class="flex flex-col items-center gap-10 md:items-start">
				<div class="relative w-full">
					<div
						class="overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-200/40 shadow-[0_30px_80px_rgba(15,23,42,0.15)]"
					>
						<img
							src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=80"
							alt="Zwart-wit portret vastgelegd door Beau Robijn Studios"
							class="h-full w-full object-cover object-center sm:aspect-[4/5]"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</div>

				<div class="flex w-full flex-col gap-6">
					<div
						class="font-lifted flex items-center justify-center gap-3 text-xs uppercase text-neutral-500 md:justify-start"
					>
						<span class="h-px w-10 bg-neutral-300"></span>
						Bekijk mijn werk
						<span class="h-px w-10 bg-neutral-300"></span>
					</div>

					<div class="flex flex-col gap-3 text-center md:flex-row md:items-stretch md:justify-start md:text-left">
						<a
							href="/portfolio"
							class="group relative flex-1 overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 px-6 py-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] transition-all hover:border-neutral-900 hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]"
						>
							<span class="font-lifted text-xs uppercase text-neutral-400">Portfolio</span>
							<span class="font-display mt-2 block text-lg font-semibold text-neutral-900"
								>Curatie van recente series</span
							>
							<span class="mt-3 block text-sm text-neutral-600"
								>Setdesign, portretten en autonome projecten geselecteerd uit het archief.</span
							>
							<span class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-900">
								Bekijk selectie
								<span
									class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[0.6rem] text-white transition-transform group-hover:translate-x-1"
									>→</span
								>
							</span>
						</a>

						<a
							href="/featured-series"
							class="group relative flex-1 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900/90 px-6 py-6 text-white shadow-[0_25px_50px_rgba(15,23,42,0.16)] transition-all hover:bg-neutral-900"
						>
							<span class="font-lifted text-xs uppercase text-neutral-300">Uitgelichte series</span>
							<span class="font-display mt-2 block text-lg font-semibold">Visuele verhalen vol sfeer</span>
							<span class="mt-3 block text-sm text-neutral-200"
								>Diepere duiken in langetermijnprojecten met aandacht voor emotie en detail.</span
							>
							<span class="mt-4 inline-flex items-center gap-2 text-sm font-medium">
								Ontdek verhalen
								<span
									class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[0.6rem] text-neutral-900 transition-transform group-hover:translate-x-1"
									>→</span
								>
							</span>
						</a>
					</div>
				</div>
			</div>

			<div class="relative text-right md:text-left">
				<h1
					class="font-display text-[clamp(3rem,4vw+2rem,5.4rem)] font-black uppercase leading-[0.95] tracking-tight text-neutral-900 md:text-[clamp(3.5rem,4vw+2rem,6rem)]"
				>
					<span class="bg-white/90 px-2">Beau</span>
					<span class="block bg-white/90 px-2">Robijn</span>
					<span class="block bg-white/90 px-2 text-[clamp(2.4rem,2.3vw+1.1rem,3.6rem)] text-neutral-500">
						Studios
					</span>
				</h1>
				<div class="mt-10 flex flex-col items-end gap-4 text-right md:items-start md:text-left">
					<div class="font-lifted relative inline-block text-xs uppercase text-neutral-500">
						Fotograaf & Regisseur
						<span class="absolute -bottom-2 left-0 block h-px w-full bg-neutral-300/70"></span>
					</div>
					<div class="relative max-w-xs text-sm leading-relaxed text-neutral-600 md:max-w-sm md:pl-6 md:text-base">
						<span class="hidden md:absolute md:left-0 md:top-2 md:block md:h-12 md:w-px md:bg-neutral-200"></span>
						Ik leg eerlijke portretten en verhalende beelden vast met oog voor textuur, licht en
						filmische gelaagdheid.
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
