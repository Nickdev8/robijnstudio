<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-white text-neutral-900">
	<div class="flex-1">
		{@render children?.()}
	</div>
	<Footer />
</div>
