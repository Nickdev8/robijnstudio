<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { contact } = data;
	const packages = contact.packages;
	const contactEmail = contact.email;
</script>

<svelte:head>
	<title>Contact | Beau Robijn Studios</title>
	<meta
		name="description"
		content="Neem contact op met Beau Robijn Studios. Kies een pakket, vertel je verhaal en plan een shoot."
	/>
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="contact">
	<Header />

	<main class="flex flex-1 justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="grid w-full max-w-5xl items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
			<section class="flex flex-col gap-6">
				<p class="text-xs uppercase tracking-[0.35em] text-neutral-500">Laten we samenwerken</p>
				<h1 class="font-display text-[clamp(2.3rem,3vw+1.5rem,3.8rem)] uppercase leading-[1.05] text-neutral-900">
					Vertel me over jouw project
				</h1>
				<p class="text-base leading-relaxed text-neutral-600 sm:text-lg">
					{contact.description}
				</p>
				<div class="rounded-3xl bg-neutral-50/80 p-6 text-sm text-neutral-600 sm:text-base">
					<p class="font-display text-lg text-neutral-900">Snelle info</p>
					<ul class="mt-4 space-y-3">
						{#each contact.bullets as bullet}
							<li class="flex items-center gap-3">
								<span class="h-2 w-2 rounded-full bg-neutral-900"></span>
								{bullet}
							</li>
						{/each}
					</ul>
				</div>
			</section>

			<section>
				<form class="space-y-6 rounded-[2rem] border border-neutral-200 bg-white/85 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:rounded-[2.5rem] sm:p-8">
					<div class="grid gap-6 sm:grid-cols-2">
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Voornaam</span>
							<input
								type="text"
								name="firstName"
								placeholder="Je voornaam"
								required
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Achternaam</span>
							<input
								type="text"
								name="lastName"
								placeholder="Je achternaam"
								required
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
							/>
						</label>
					</div>

					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">E-mail</span>
						<input
							type="email"
							name="email"
							placeholder="you@email.com"
							required
							class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						/>
					</label>

					<fieldset class="space-y-4">
						<legend class="font-display text-lg text-neutral-900">Kies een pakket</legend>
						<p class="text-sm text-neutral-500">Selecteer een van de opties of kies “Custom Story” voor iets op maat.</p>
						<div class="grid gap-4">
							{#each packages as pakket}
								<label
									class="group flex cursor-pointer flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-5 py-4 transition-all hover:border-neutral-900 hover:bg-white sm:flex-row sm:items-center"
								>
									<div class="flex items-center gap-3">
										<input
											type="radio"
											name="pakket"
											value={pakket.id}
											required
											class="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-900/30"
										/>
										<div>
											<p class="font-display text-base text-neutral-900">{pakket.title}</p>
											<p class="text-sm text-neutral-500">{pakket.description}</p>
										</div>
										<span class="ml-auto font-lifted text-[0.65rem] uppercase tracking-[0.45em] text-neutral-400">
											{pakket.price}
										</span>
									</div>
								</label>
							{/each}
						</div>
					</fieldset>

					<label class="flex flex-col gap-2 text-sm text-neutral-600">
						<span class="font-lifted text-xs uppercase tracking-[0.45em] text-neutral-400">Vertel iets over je idee</span>
						<textarea
							name="message"
							rows="5"
							placeholder="Waar wil je de focus op leggen? Zijn er locaties die je aanspreken? Mag ik meedenken over styling?"
							required
							class="resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
						></textarea>
					</label>

					<button
						type="submit"
						class="font-display inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:translate-y-[-1px] hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 sm:w-auto"
					>
						Verstuur aanvraag
					</button>
				</form>

				<p class="mt-6 text-sm text-neutral-500">
					{contact.outro}
					<a
						href={`mailto:${contactEmail}`}
						class="underline decoration-neutral-400 underline-offset-4 transition hover:text-neutral-900"
					>
						{contactEmail}
					</a
					>.
				</p>
			</section>
		</div>
	</main>
</div>
