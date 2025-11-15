<script lang="ts">
	import PageTagline from '$lib/components/PageTagline.svelte';
	import { env as publicEnv } from '$env/dynamic/public';
	import captchaEnhance from 'svelte-captcha-enhance';
	import type { ActionData, PageData } from './$types';

export let data: PageData;
export let form: ActionData | undefined;

const { contact } = data;
const packages = contact.packages;
const contactEmail = contact.email;
const recaptchaSiteKey = publicEnv.PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? '';
const captchaOptions = recaptchaSiteKey
	? ({ type: 'recaptcha', sitekey: recaptchaSiteKey, action: 'contact' } as const)
	: ({ type: 'bypass' } as const);
const shareImage = {
	src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
	alt: 'Contactmoment tijdens een fotoshoot in Amsterdam'
};
</script>

<svelte:head>
	<title>Contact | Beau Robijn Fotografie</title>
	<meta
		name="description"
		content="Neem contact op met Beau Robijn Fotografie. Kies een pakket, vertel je verhaal en plan een shoot."
	/>
	<meta property="og:title" content="Contact | Beau Robijn Fotografie" />
	<meta
		property="og:description"
		content="Neem contact op met Beau Robijn Fotografie. Kies een pakket, vertel je verhaal en plan een shoot."
	/>
	<meta property="og:image" content={shareImage.src} />
	<meta property="og:image:alt" content={shareImage.alt} />
	<meta name="twitter:title" content="Contact | Beau Robijn Fotografie" />
	<meta
		name="twitter:description"
		content="Neem contact op met Beau Robijn Fotografie. Kies een pakket, vertel je verhaal en plan een shoot."
	/>
	<meta name="twitter:image" content={shareImage.src} />
	<meta name="twitter:image:alt" content={shareImage.alt} />
	{#if recaptchaSiteKey}
		<script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} async defer></script>
	{/if}
</svelte:head>

<div class="flex flex-1 flex-col bg-white" id="contact">
	<main class="flex flex-1 justify-center px-4 pb-20 pt-14 sm:px-6 sm:pt-16">
		<div class="grid w-full max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
			<section class="flex flex-col gap-6">
				<PageTagline text={contact.tagline} />
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
								<span class="h-2 w-2 rounded-full bg-rose-600"></span>
								{bullet}
							</li>
						{/each}
					</ul>
				</div>
			</section>

			<section>
				{#if form?.success}
					<div
						class="space-y-6 rounded-[2rem] border border-neutral-200 bg-white/90 p-8 text-neutral-700 shadow-[0_24px_55px_rgba(15,23,42,0.12)] sm:rounded-[2.5rem]"
						role="status"
						aria-live="polite"
					>
						<div class="flex flex-col gap-4">
							<span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
								<span class="text-2xl font-semibold">✓</span>
							</span>
							<h2 class="font-display text-2xl text-neutral-900">Bedankt voor je bericht</h2>
							<p>
								Je aanvraag is succesvol verzonden. Ik neem binnen 48 uur contact met je op via
								<span class="font-medium text-neutral-900">{contactEmail}</span>.
							</p>
							<p class="text-sm text-neutral-500">
								Mocht je binnen die tijd niets van me horen, stuur dan gerust een mail naar
								<a href={`mailto:${contactEmail}`} class="underline decoration-neutral-400 underline-offset-4 hover:text-rose-700">
									{contactEmail}
								</a>
								met een verwijzing naar je aanvraag.
							</p>
						</div>
						<a
							href="/"
						class="font-display inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-8 py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:translate-y-[-1px] hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600/20 sm:w-auto"
						>
							Terug naar home
						</a>
					</div>
				{:else}
					<form
						method="post"
						class="space-y-6 rounded-[2rem] border border-neutral-200 bg-white/85 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:rounded-[2.5rem] sm:p-8"
						use:captchaEnhance={captchaOptions}
					>
						<label
							class="sr-only"
							style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;"
							aria-hidden="true"
						>
							<span>Laat dit veld leeg</span>
							<input type="text" name="company" tabindex="-1" autocomplete="off" />
						</label>
						<div class="grid gap-6 sm:grid-cols-2">
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Voornaam</span>
								<input
									type="text"
									name="firstName"
									placeholder="Je voornaam"
									required
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
								/>
							</label>
							<label class="flex flex-col gap-2 text-sm text-neutral-600">
								<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Achternaam</span>
								<input
									type="text"
									name="lastName"
									placeholder="Je achternaam"
									required
									class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
								/>
							</label>
						</div>

						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">E-mail</span>
							<input
								type="email"
								name="email"
								placeholder="you@email.com"
								required
								class="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
							/>
						</label>

						<fieldset class="space-y-4">
							<legend class="font-display text-lg text-neutral-900">Kies een pakket</legend>
							<p class="text-sm text-neutral-500">Selecteer een van de opties of kies “Custom Story” voor iets op maat.</p>
							<div class="grid gap-4">
								{#each packages as pakket}
									<label
										class="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-5 py-4 transition-all hover:border-rose-600 hover:bg-white md:flex-row md:items-center"
									>
										<div class="flex flex-1 items-center gap-3">
											<input
												type="radio"
												name="pakket"
												value={pakket.id}
												required
												class="h-4 w-4 border-neutral-300 text-rose-600 focus:ring-rose-600/30"
											/>
											<div>
												<p class="font-display text-base text-neutral-900">{pakket.title}</p>
												<p class="text-sm text-neutral-500">{pakket.description}</p>
											</div>
											<span class="ml-auto font-lifted text-[0.65rem] uppercase tracking-[0.28em] text-neutral-400 md:pl-4">
												{pakket.price}
											</span>
										</div>
									</label>
								{/each}
							</div>
						</fieldset>

						<label class="flex flex-col gap-2 text-sm text-neutral-600">
							<span class="font-lifted text-xs uppercase tracking-[0.32em] text-neutral-400">Vertel iets over je idee</span>
							<textarea
								name="message"
								rows="5"
								placeholder="Waar wil je de focus op leggen? Zijn er locaties die je aanspreken? Mag ik meedenken over styling?"
								required
							class="resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-rose-600 focus:ring-2 focus:ring-rose-600/10"
							></textarea>
						</label>

						{#if form?.error}
							<p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">{form.error}</p>
						{/if}
						<button
							type="submit"
						class="font-display inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-8 py-3 text-sm uppercase tracking-[0.3em] text-white transition hover:translate-y-[-1px] hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600/20 sm:w-auto cursor-pointer"
					>
						Verstuur aanvraag
					</button>
					</form>
				{/if}

				<p class="mt-6 text-sm text-neutral-500">
					{contact.outro}
						<a
							href={`mailto:${contactEmail}`}
							class="underline decoration-neutral-400 underline-offset-4 transition hover:text-rose-700"
						>
						{contactEmail}
					</a
					>.
				</p>
			</section>
		</div>
	</main>
</div>
