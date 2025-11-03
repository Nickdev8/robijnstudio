<script lang="ts">
	export let src: string | null | undefined;
	export let alt: string | null | undefined = '';
	export let label = 'Voorbeeld';

	const normalizeSrc = (value: string | null | undefined) => value?.trim() ?? '';

	$: previewSrc = normalizeSrc(src);
	$: description = alt?.trim() ?? '';
</script>

{#if previewSrc}
	<figure class="mt-3 space-y-2 text-xs text-neutral-500">
		<span class="font-lifted uppercase tracking-[0.28em] text-neutral-400">{label}</span>
		<div class="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm">
			<img
				src={previewSrc}
				alt={description || `${label} afbeelding`}
				class="h-48 w-full object-cover"
				loading="lazy"
				decoding="async"
			/>
		</div>
		{#if description}
			<p class="truncate text-neutral-400">Alt: {description}</p>
		{/if}
	</figure>
{:else}
	<p class="mt-3 text-xs uppercase tracking-[0.24em] text-neutral-300">{label}: geen voorbeeld</p>
{/if}
