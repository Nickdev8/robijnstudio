<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-neutral-200 bg-white/90 px-6 pt-10 pb-5 text-neutral-600">
	<div>
		<div
			class="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center text-sm md:flex-row md:justify-between md:text-left"
		>
			<div class="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:text-left">
				<span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 shadow-[0_12px_30px_rgba(190,24,93,0.12)]">
					<img src="/ruby.svg" alt="" class="h-6 w-6 opacity-95" loading="lazy" decoding="async" />
				</span>
				<div>
					<p class="font-display text-lg text-neutral-900">Beau Robijn Fotografie</p>
					<p class="mt-1 text-xs uppercase tracking-[0.4em] text-neutral-400">
						Fotografie &amp; verhalen
					</p>
				</div>
			</div>
			<div class="flex items-center gap-6 text-sm">
				<a
					href="https://www.instagram.com/robijn_fotografie"
					target="_blank"
					rel="noreferrer"
					class="transition-colors hover:text-rose-700"
				>
					Instagram
				</a>
				<a href="/contact" class="transition-colors hover:text-rose-700">
					info@robijnstudios.nl
				</a>
			</div>
			<div class="text-xs text-neutral-400 md:text-right">© {year} Beau Robijn Fotografie</div>
		</div>
		<div class="flex flex-col items-center gap-1 pt-5 text-center text-xs text-neutral-400 sm:flex-row sm:justify-center sm:gap-2">
			<span>Website gemaakt door Nick Esselman.</span>
			<span class="hidden text-neutral-300 sm:inline">•</span>
			<a class="text-neutral-500 transition-colors hover:text-rose-700" href="https://blog.nickesselman.nl/contact">
				info@nickesselman.nl
			</a>
		</div>
	</div>
</footer>
