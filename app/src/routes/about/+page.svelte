<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { about } = data;
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

	<main class="flex flex-1 items-center justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="grid w-full max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
			<section class="flex flex-col gap-8">
				<p class="text-xs uppercase tracking-[0.35em] text-neutral-500">{about.introTag}</p>
				<h1 class="font-display text-[clamp(2.3rem,3vw+1.5rem,3.8rem)] uppercase leading-[1.05] text-neutral-900">
					{about.headline}
				</h1>
				{#each about.paragraphs as paragraph}
					<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
						{paragraph}
					</p>
				{/each}

				<div class="grid gap-4 rounded-3xl bg-neutral-50/80 p-6 text-sm text-neutral-600 sm:grid-cols-3">
					{#each about.stats as stat}
						<div>
							<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">{stat.label}</p>
							<p class="mt-2 font-display text-lg text-neutral-900">{stat.value}</p>
						</div>
					{/each}
				</div>

				<div class="space-y-5">
					<p class="text-xs uppercase tracking-[0.35em] text-neutral-500">Projecten waar ik trots op ben</p>
					<div class="space-y-6">
						{#each about.projects as project}
							<a
								href={project.href}
								target="_blank"
								rel="noreferrer"
								class="group flex flex-col gap-2 border-b border-neutral-200 pb-5 transition-colors hover:border-neutral-900"
							>
								<span class="font-display text-xl text-neutral-900">{project.title}</span>
								<span class="text-sm text-neutral-500">
									{project.description}
								</span>
								<span
									class="font-lifted text-[0.65rem] uppercase tracking-[0.4em] text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-900"
									>Bekijk project →</span
								>
							</a>
						{/each}
					</div>
				</div>
			</section>

			<section class="flex flex-col gap-8">
				<div class="relative">
					<div
						class="overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-200/40 shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:rounded-[3rem]"
					>
						<img
							src={about.portrait.src}
							alt={about.portrait.alt}
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</div>

				<div class="grid gap-6 rounded-3xl bg-neutral-900/90 p-8 text-white">
					<p class="font-display text-xl">Wat mensen zeggen</p>
					<blockquote class="text-sm leading-relaxed text-neutral-100 sm:text-base">
						{about.testimonial.quote}
					</blockquote>
					<p class="font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-300">
						{about.testimonial.source}
					</p>
				</div>
			</section>
		</div>
	</main>
</div>
