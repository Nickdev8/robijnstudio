<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-white text-neutral-900">
	{#if !$page.url.pathname.startsWith('/admin')}
		<Header />
	{/if}
	<div class="flex flex-1 flex-col">
		{@render children?.()}
	</div>
	<Footer />
</div>
