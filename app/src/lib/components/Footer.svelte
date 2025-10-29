<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-neutral-200 bg-white/90 px-6 pt-10 pb-5 text-neutral-600">
	<div>
		<div
			class="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center text-sm md:flex-row md:justify-between md:text-left"
		>
			<div>
				<p class="font-display text-lg text-neutral-900">Beau Robijn Fotografie</p>
				<p class="mt-1 text-xs uppercase tracking-[0.4em] text-neutral-400">
					Fotografie &amp; verhalen
				</p>
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
				<a href="mailto:info@robijnstudios.nl" class="transition-colors hover:text-rose-700">
					info@robijnstudios.nl
				</a>
			</div>
			<div class="text-xs text-neutral-400 md:text-right">© {year} Beau Robijn Fotografie</div>
		</div>
		<div class="text-xs text-neutral-400 md:text-center pt-5">
			Website gemaakt door Nick Esselman. Contact: info@nickesselman.nl
		</div>
	</div>
</footer>
