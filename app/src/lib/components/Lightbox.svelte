<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { buildSrcSet } from '$lib/utils/image';

	type LightboxImage = {
		src: string;
		alt?: string;
	};

	export type { LightboxImage };

	export let image: LightboxImage | null;
	export let onClose: () => void;

	let container: HTMLDivElement | null = null;
	let closeButton: HTMLButtonElement | null = null;

	let mounted = false;
	let previousOverflow = '';
	let previousActive: HTMLElement | null = null;

	const focusableSelector =
		'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	const handleFocusTrap = (event: KeyboardEvent) => {
		if (!container) return;

		const focusable = Array.from(
			container.querySelectorAll<HTMLElement>(focusableSelector)
		).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (!image) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
			return;
		}

		if (event.key === 'Tab') {
			handleFocusTrap(event);
		}
	};

	const activateLightbox = async () => {
		if (!browser || !image) return;

		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		previousActive = document.activeElement as HTMLElement | null;

		await tick();
		container?.focus();
		closeButton?.focus();
	};

	const deactivateLightbox = () => {
		if (!browser) return;

		document.body.style.overflow = previousOverflow;

		if (previousActive) {
			previousActive.focus();
			previousActive = null;
		}
	};

	onMount(() => {
		mounted = true;
		if (image) {
			void activateLightbox();
		}
	});

	$: if (mounted && image) {
		void activateLightbox();
	} else if (mounted && !image) {
		deactivateLightbox();
	}

	onDestroy(() => {
		deactivateLightbox();
	});

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	$: lightboxAlt = image?.alt ?? 'Uitvergroot portfolio beeld';
	$: lightboxSrc = image?.src ?? '';
	$: lightboxSrcSet = image ? buildSrcSet(image.src, [768, 1280, 1600, 2048, 2560]) : '';
	$: lightboxSizes = '(min-width: 1280px) min(80vw, 1400px), (min-width: 768px) 80vw, 94vw';
</script>

{#if image}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 px-4 py-10 backdrop-blur-sm sm:px-8"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		bind:this={container}
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
	>
		<figure
			class="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-8"
		>
			<button
				type="button"
				class="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-neutral-900/60 text-2xl text-white transition hover:scale-105 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white/40"
				aria-label="Sluit volledige weergave"
				on:click={() => onClose()}
				bind:this={closeButton}
			>
				×
			</button>

			<div class="flex max-h-[min(80vh,900px)] w-full items-center justify-center overflow-hidden px-2">
				<img
					src={lightboxSrc}
					srcset={lightboxSrcSet}
					sizes={lightboxSizes}
					alt={lightboxAlt}
					class="block max-h-full w-auto max-w-full object-contain"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</div>

			{#if image.alt}
				<figcaption class="mt-6 text-center text-sm text-neutral-200">
					{image.alt}
				</figcaption>
			{/if}
		</figure>
	</div>
{/if}
