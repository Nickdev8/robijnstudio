<script lang="ts">
import PageTagline from '$lib/components/PageTagline.svelte';
import { buildSrcSet, defaultSizes } from '$lib/utils/image';
import type { PageData } from './$types';

export let data: PageData;
const { about } = data;
const heroTestimonial = about.testimonials?.[0];
const secondaryTestimonials = about.testimonials?.slice(1) ?? [];
</script>

<svelte:head>
	<title>Over Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Leer Beau Robijn kennen — student fotografie met een oog voor intieme portretseries en documentaire projecten."
	/>
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="about">
	<main class="flex flex-1 items-center justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="grid w-full max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
			<section class="flex flex-col gap-8">
				<PageTagline text={about.introTag} />
				<h1 class="font-display text-[clamp(1.8rem,2.4vw+1.1rem,2.8rem)] uppercase leading-[1.08] text-neutral-900">
					{about.headline}
				</h1>
				{#each about.paragraphs as paragraph}
					<p class="max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
						{paragraph}
					</p>
				{/each}

				<div class="grid gap-4 rounded-3xl bg-neutral-50/80 p-6 text-sm text-neutral-600 sm:grid-cols-2 md:grid-cols-3">
					{#each about.stats as stat}
						<div>
							<p class="font-lifted text-[0.65rem] uppercase tracking-[0.34em] text-neutral-400">{stat.label}</p>
							<p class="mt-2 font-display text-lg text-rose-700">{stat.value}</p>
						</div>
					{/each}
				</div>

				<div class="space-y-5">
					<p class="text-xs uppercase tracking-[0.32em] text-neutral-500">Case studies & projecten</p>
					<div class="grid gap-6 lg:grid-cols-2">
						{#each about.projects as project}
							<article class="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition hover:border-rose-500/50 hover:shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
								<div class="flex flex-col gap-2">
									<h3 class="font-display text-lg text-neutral-900">{project.title}</h3>
									<p class="text-sm leading-relaxed text-neutral-600">{project.description}</p>
									{#if project.result}
										<p class="text-sm font-medium text-neutral-900">{project.result}</p>
									{/if}
								</div>
								<div class="flex flex-wrap items-center gap-3">
									<a
										href={project.href}
										target="_blank"
										rel="noreferrer"
										class="font-display inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-rose-700"
									>
										Bekijk project
									</a>
								</div>
								{#if project.videoUrl}
									<div class="overflow-hidden rounded-2xl border border-neutral-200">
										<iframe
											src={project.videoUrl}
											title={`Video ${project.title}`}
											loading="lazy"
											referrerpolicy="no-referrer"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
											allowfullscreen
											class="aspect-video w-full"
										></iframe>
									</div>
								{/if}
							</article>
						{/each}
					</div>
				</div>
			</section>

			<section class="flex flex-col gap-8">
				<div class="relative">
					<div
						class="overflow-hidden rounded-[2.5rem] border border-rose-200 bg-neutral-200/40 shadow-[0_35px_90px_rgba(15,23,42,0.18)] sm:rounded-[3rem]"
					>
						<img
							src={about.portrait.src}
							srcset={buildSrcSet(about.portrait.src)}
							sizes={defaultSizes}
							alt={about.portrait.alt}
							class="h-full w-full object-cover object-center"
							loading="lazy"
							decoding="async"
						/>
					</div>
				</div>

				{#if heroTestimonial}
					<div class="grid gap-4 rounded-3xl bg-rose-700/95 p-8 text-rose-50">
						<p class="font-display text-xl text-white">Wat mensen zeggen</p>
						<blockquote class="text-sm leading-relaxed text-rose-50 sm:text-base">
							{heroTestimonial.quote}
						</blockquote>
						<p class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-rose-200">
							{heroTestimonial.source}
						</p>
					</div>
				{/if}

				{#if secondaryTestimonials.length}
					<div class="grid gap-4 sm:grid-cols-2">
						{#each secondaryTestimonials as testimonial}
							<figure class="flex h-full flex-col justify-between gap-3 rounded-3xl border border-neutral-200 bg-white/95 p-5 text-neutral-700 shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
								<blockquote class="text-sm leading-relaxed text-neutral-600 sm:text-base">{testimonial.quote}</blockquote>
								<figcaption class="font-lifted text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">
									{testimonial.source}
								</figcaption>
							</figure>
						{/each}
					</div>
				{/if}
			</section>
		</div>
	</main>
</div>
