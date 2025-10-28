<script lang="ts">
	import { onMount } from 'svelte';

	export type LightboxImage = {
		src: string;
		alt?: string;
	};

	let { image, onClose }: { image: LightboxImage | null; onClose: () => void } = $props();

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if image}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		onclick={() => onClose()}
		onkeydown={(event) => {
			if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClose();
			}
		}}
	>
		<button
			type="button"
			class="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
			onclick={(event) => {
				event.stopPropagation();
				onClose();
			}}
			aria-label="Sluit volledige weergave"
		>
			×
		</button>

		<div
			class="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
			onpointerdown={(event) => event.stopPropagation()}
		>
			<img
				src={image.src}
				alt={image.alt ?? 'Uitvergroot portfolio beeld'}
				class="h-full w-full object-contain"
				loading="eager"
				decoding="async"
			/>
			{#if image.alt}
				<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-8 pb-8 pt-16 text-sm text-white">
					{image.alt}
				</div>
			{/if}
		</div>
	</div>
{/if}
