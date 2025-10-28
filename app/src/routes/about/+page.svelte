<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Over Beau Robijn Studios</title>
	<meta
		name="description"
		content="Leer Beau Robijn kennen — student fotografie met een oog voor intieme portretseries en documentaire projecten."
	/>
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="about">
	<Header />

	<main class="flex flex-1 items-center justify-center px-6 pb-20 pt-16">
		<div class="grid w-full max-w-6xl items-start gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
			<section class="flex flex-col gap-8">
				<p class="font-lifted text-xs uppercase text-neutral-500">Student · Fotograaf · Verteller</p>
				<h1 class="font-display text-[clamp(2.6rem,3vw+1.5rem,4rem)] uppercase leading-[1.05] text-neutral-900">
					Ik ben Beau Robijn, een student die zoekt naar echte momenten
				</h1>
				<p class="max-w-xl text-base leading-relaxed text-neutral-600">
					In mijn studie audiovisuele vormgeving verdiep ik me in analoge processen en hedendaagse fotografie. Mijn
					werk draait om subtiele gebaren, huidtextuur en die ene seconde waarin iemand zichzelf vergeet. Ik geloof
					er heilig in dat een goede foto voelt alsof je er zelf bij was.
				</p>
				<p class="max-w-xl text-base leading-relaxed text-neutral-600">
					Naast lessen en stages werk ik aan persoonlijke projecten die variëren van documentaire portretten van
					medestudenten tot fictieve modeshoots. Ik neem je graag mee achter de schermen van wat mij inspireert en
					hoe ik als jonge maker groei.
				</p>

				<div class="grid gap-4 rounded-3xl bg-neutral-50/80 p-6 text-sm text-neutral-600 sm:grid-cols-3">
					<div>
						<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Studie</p>
						<p class="mt-2 font-display text-lg text-neutral-900">Audiovisueel, HKU</p>
					</div>
					<div>
						<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Specialiteit</p>
						<p class="mt-2 font-display text-lg text-neutral-900">Portret &amp; korte docu</p>
					</div>
					<div>
						<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">Werkveld</p>
						<p class="mt-2 font-display text-lg text-neutral-900">NLD &amp; BE</p>
					</div>
				</div>

				<div class="space-y-5">
					<p class="font-lifted text-xs uppercase text-neutral-500">Projecten waar ik trots op ben</p>
					<div class="space-y-6">
						<a
							href="https://robijnstudios.nl/project/soft-echo"
							target="_blank"
							rel="noreferrer"
							class="group flex flex-col gap-2 border-b border-neutral-200 pb-5 transition-colors hover:border-neutral-900"
						>
							<span class="font-display text-xl text-neutral-900">Soft Echo</span>
							<span class="text-sm text-neutral-500"
								>Zachte portretserie over queer identiteit, geschoten op 120mm film en tentoongesteld tijdens de academiedagen.</span
							>
							<span
								class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
								>Bekijk project →</span
							>
						</a>

						<a
							href="https://robijnstudios.nl/project/evening-lines"
							target="_blank"
							rel="noreferrer"
							class="group flex flex-col gap-2 border-b border-neutral-200 pb-5 transition-colors hover:border-neutral-900"
						>
							<span class="font-display text-xl text-neutral-900">Evening Lines</span>
							<span class="text-sm text-neutral-500"
								>Cinematische reeks tijdens blauwe uurtjes op industrieterreinen; een dialoog tussen licht en lonely architecture.</span
							>
							<span
								class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
								>Bekijk project →</span
							>
						</a>

						<a
							href="https://robijnstudios.nl/project/close-to-sound"
							target="_blank"
							rel="noreferrer"
							class="group flex flex-col gap-2 border-b border-neutral-200 pb-5 transition-colors hover:border-neutral-900"
						>
							<span class="font-display text-xl text-neutral-900">Close to Sound</span>
							<span class="text-sm text-neutral-500"
								>Korte docu over jonge muzikanten in Rotterdam, waarin beeld en geluid samensmelten tot een intieme repetitie-ervaring.</span
							>
							<span
								class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
								>Bekijk project →</span
							>
						</a>
					</div>
				</div>
			</section>

			<section class="flex flex-col gap-8">
				<div class="relative">
					<div
						class="overflow-hidden rounded-[3rem] border border-neutral-200 bg-neutral-200/40 shadow-[0_35px_90px_rgba(15,23,42,0.18)]"
					>
						<img
							src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80"
							alt="Beau Robijn aan het werk in de studio"
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<span
						class="font-lifted absolute right-8 top-8 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.5em] text-neutral-500"
					>
						Behind the scenes
					</span>
				</div>

				<div class="grid gap-6 rounded-3xl bg-neutral-900/90 p-8 text-white">
					<p class="font-display text-xl">Wat mensen zeggen</p>
					<blockquote class="text-sm leading-relaxed text-neutral-100">
						“Beau heeft een bijzondere gevoeligheid voor het kleine detail. Zelfs als student levert ze beelden af met
						een niveau van rust en intensiteit dat je normaal alleen bij ervaren freelancers ziet.”
					</blockquote>
					<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-300">
						— Docent fotografie, HKU
					</p>
				</div>
			</section>
		</div>
	</main>
</div>
