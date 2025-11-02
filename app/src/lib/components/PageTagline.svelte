<script lang="ts">
	export let text: string;
</script>

<p class="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-neutral-500 sm:text-xs sm:tracking-[0.38em]">
	<span class="inline-flex h-3 w-3 items-center justify-center rounded-sm bg-gradient-to-br from-rose-100 to-rose-200/80 p-[2px] shadow-[0_4px_10px_rgba(190,24,93,0.18)]">
		<img src="/ruby.svg" alt="" class="h-full w-full opacity-90" loading="lazy" decoding="async" />
	</span>
	<span class="font-lifted">{text}</span>
</p>
