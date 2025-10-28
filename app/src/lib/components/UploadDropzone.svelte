<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const MAX_SIZE_BYTES = 5 * 1024 * 1024;
	const MAX_SIZE_LABEL = '5 MB';

	type UploadEvents = {
		upload: { url: string };
		error: { message: string };
	};

	export let url: string;
	export let accept: string[] = [
		'image/jpeg',
		'image/png',
		'image/webp',
		'image/gif',
		'image/svg+xml'
	];

	const dispatch = createEventDispatcher<UploadEvents>();

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
				let errorMessage = 'Upload mislukt.';
				if (contentType.includes('application/json')) {
					try {
						const data = (await response.json()) as { message?: string; error?: string };
						errorMessage = data?.message ?? data?.error ?? errorMessage;
					} catch {
						errorMessage = 'Upload mislukt.';
					}
				} else {
					try {
						const text = await response.text();
						errorMessage = text || errorMessage;
					} catch {
						errorMessage = 'Upload mislukt.';
					}
				}

				throw new Error(errorMessage);
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
			const errorMessage = err instanceof Error ? err.message : 'Upload mislukt.';
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
</script>

<div class="text-xs text-neutral-500">
	<div
		class={`flex flex-col gap-2 rounded-xl border border-dashed px-4 py-3 transition ${
			isDragging ? 'border-neutral-900 bg-neutral-900/5' : 'border-neutral-300 bg-neutral-50'
		} ${status === 'error' ? 'border-red-400 bg-red-50' : ''}`}
		on:drop={onDrop}
		on:dragover={onDragOver}
		on:dragleave={onDragLeave}
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
		<p class="text-neutral-400">Ondersteund: JPG, PNG, WEBP, GIF, SVG. Maximaal {MAX_SIZE_LABEL}.</p>
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
