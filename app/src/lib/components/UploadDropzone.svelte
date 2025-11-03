<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const MAX_SIZE_BYTES = 25 * 1024 * 1024;
	const MAX_SIZE_LABEL = '25 MB';
	const SUPPORTED_FORMAT_LABEL = 'JPG, PNG, WEBP, GIF, SVG, AVIF';

	type UploadEvents = {
		upload: { url: string };
		error: { message: string };
	};

	export let url: string;
	export let accept: string[] = [
		'image/jpeg',
		'image/jpg',
		'image/pjpeg',
		'image/png',
		'image/x-png',
		'image/webp',
		'image/gif',
		'image/svg+xml',
		'image/avif'
	];

	const dispatch = createEventDispatcher<UploadEvents>();

	const guidanceBase = `Controleer of je bestand kleiner is dan ${MAX_SIZE_LABEL} en een ondersteund formaat heeft (${SUPPORTED_FORMAT_LABEL}).`;
	const guidanceFollowUp =
		'Probeer het opnieuw. Blijft het fout gaan? Vernieuw de pagina of neem contact op met de beheerder.';

	const sanitizeServerMessage = (message?: string) => {
		if (!message) return undefined;
		const trimmed = message.trim();
		if (!trimmed) return undefined;
		const normalized = trimmed.toLowerCase();
		if (normalized === 'upload mislukt' || normalized === 'upload mislukt.' || normalized === 'failed to fetch') {
			return undefined;
		}
		return trimmed;
	};

	const composeDetailedErrorMessage = (status: number | undefined, serverMessage?: string) => {
		const detail = sanitizeServerMessage(serverMessage);
		const parts: string[] = [];

		if (status === 413) {
			parts.push(`Dit bestand is groter dan toegestaan (maximaal ${MAX_SIZE_LABEL}).`);
		} else if (status === 415) {
			parts.push(
				`Dit bestandstype wordt niet ondersteund. Gebruik een van de volgende formaten: ${SUPPORTED_FORMAT_LABEL}.`
			);
		} else if (status === 400) {
			parts.push('We konden het bestand niet verwerken. Probeer het opnieuw.');
		} else if (status === 401 || status === 403) {
			parts.push('Je bent niet (meer) aangemeld als beheerder. Log opnieuw in en probeer het nogmaals.');
		} else if (status && status >= 500) {
			parts.push('Er ging iets mis op de server tijdens het uploaden.');
		} else if (status === undefined || status === 0) {
			if (detail) {
				parts.push('Het uploaden is mislukt.');
			} else {
				parts.push('We konden geen verbinding maken met de server.');
			}
		} else {
			parts.push('Het uploaden is mislukt.');
		}

		if (status !== 413 && status !== 415) {
			parts.push(guidanceBase);
		}

		if (detail) {
			parts.push(`Servermelding: ${detail}`);
		}

		parts.push(guidanceFollowUp);

		return parts.join(' ');
	};

	const isDetailedErrorMessage = (message: string) =>
		/Servermelding:/i.test(message) ||
		message.includes('Dit bestandstype wordt niet ondersteund') ||
		message.includes('Dit bestand is groter dan toegestaan') ||
		message.includes('Log opnieuw in') ||
		message.includes('We konden geen verbinding maken met de server') ||
		message.includes('Probeer het opnieuw.');

let status: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
let message = '';
let fileInput: HTMLInputElement | null = null;
let isDragging = false;

	async function handleFiles(fileList: FileList | null) {
		const file = fileList?.[0];
		if (!file) return;

		if (!accept.includes(file.type)) {
			const errorMessage = 'Alleen afbeeldingsbestanden zijn toegestaan.';
			status = 'error';
			message = errorMessage;
			dispatch('error', { message: errorMessage });
			return;
		}

		if (file.size > MAX_SIZE_BYTES) {
			const errorMessage = `Bestand is te groot (maximaal ${MAX_SIZE_LABEL}).`;
			status = 'error';
			message = errorMessage;
			dispatch('error', { message: errorMessage });
			return;
		}

		status = 'uploading';
		message = 'Uploaden...';

		try {
			const formData = new FormData();
			formData.set('file', file);

			const response = await fetch('/admin/upload', {
				method: 'POST',
				body: formData
			});
			const contentType = response.headers.get('content-type') ?? '';

			if (!response.ok) {
				let serverMessage: string | undefined;
				if (contentType.includes('application/json')) {
					try {
						const data = (await response.json()) as { message?: string; error?: string };
						serverMessage = data?.message ?? data?.error ?? undefined;
					} catch {
						serverMessage = undefined;
					}
				} else {
					try {
						const text = await response.text();
						serverMessage = text || undefined;
					} catch {
						serverMessage = undefined;
					}
				}

				throw new Error(composeDetailedErrorMessage(response.status, serverMessage));
			}

			let uploadedUrl: string | undefined;
			if (contentType.includes('application/json')) {
				const data = (await response.json()) as { url?: string };
				uploadedUrl = data?.url;
			} else {
				const text = await response.text();
				uploadedUrl = text || undefined;
			}

			if (!uploadedUrl) {
				throw new Error('Server gaf geen URL terug.');
			}

			const resolvedUrl =
				uploadedUrl.startsWith('http://') ||
				uploadedUrl.startsWith('https://') ||
				uploadedUrl.startsWith('//')
					? uploadedUrl
					: typeof window !== 'undefined'
						? new URL(uploadedUrl, window.location.origin).toString()
						: uploadedUrl;

			url = resolvedUrl;
			status = 'success';
			message = 'Upload voltooid.';
			dispatch('upload', { url: resolvedUrl });
			setTimeout(() => {
				if (status === 'success') {
					status = 'idle';
					message = '';
				}
			}, 4000);
		} catch (err) {
			let errorMessage: string;
			if (err instanceof Error) {
				const trimmedMessage = err.message?.trim();
				if (trimmedMessage && isDetailedErrorMessage(trimmedMessage)) {
					errorMessage = trimmedMessage;
				} else if (err instanceof TypeError || err.name === 'TypeError' || trimmedMessage === 'Failed to fetch') {
					errorMessage = composeDetailedErrorMessage(undefined);
				} else {
					errorMessage = composeDetailedErrorMessage(undefined, trimmedMessage);
				}
			} else {
				errorMessage = composeDetailedErrorMessage(undefined);
			}
			status = 'error';
			message = errorMessage;
			dispatch('error', { message: errorMessage });
		} finally {
			isDragging = false;
			if (fileInput) {
				fileInput.value = '';
			}
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		handleFiles(event.dataTransfer?.files ?? null);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function openFilePicker() {
		fileInput?.click();
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openFilePicker();
		}
	}
</script>

<div class="text-xs text-neutral-500">
	<div
		class={`flex flex-col gap-2 rounded-xl border border-dashed px-4 py-3 transition ${
			isDragging ? 'border-neutral-900 bg-neutral-900/5' : 'border-neutral-300 bg-neutral-50'
		} ${status === 'error' ? 'border-red-400 bg-red-50' : ''}`}
		role="button"
		tabindex="0"
		aria-label="Sleep een afbeelding hierheen of kies een bestand"
		on:drop={onDrop}
		on:dragover={onDragOver}
		on:dragleave={onDragLeave}
		on:keydown={onKeyDown}
	>
		<p class="text-neutral-500">
			Sleep een afbeelding hierheen of
			<button
				type="button"
				class="font-semibold text-neutral-900 underline underline-offset-2"
				on:click={openFilePicker}
			>
				kies een bestand
			</button>
			.
		</p>
		<p class="text-neutral-400">Ondersteund: {SUPPORTED_FORMAT_LABEL}. Maximaal {MAX_SIZE_LABEL}.</p>
		{#if status === 'uploading'}
			<p class="text-neutral-500">Bezig met uploaden...</p>
		{:else if status === 'success'}
			<p class="text-emerald-600">Upload voltooid. De URL is bijgewerkt.</p>
		{:else if status === 'error'}
			<p class="text-red-600">{message}</p>
		{/if}
		{#if status === 'idle' && url}
			<p class="truncate text-neutral-400">Huidige waarde: {url}</p>
		{/if}
	</div>
	<input
		type="file"
		class="hidden"
		bind:this={fileInput}
		accept={accept.join(',')}
		on:change={(event) => handleFiles((event.currentTarget as HTMLInputElement).files)}
	/>
</div>
