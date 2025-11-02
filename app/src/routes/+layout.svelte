<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutData } from './$types';

	const { children, data } = $props<{ children: () => unknown; data: LayoutData }>();
</script>

<svelte:head>
	<link rel="icon" href="/ruby.svg" type="image/svg+xml" />
	{#if data?.canonical}
		<link rel="canonical" href={data.canonical} />
		<meta property="og:url" content={data.canonical} />
		<meta name="twitter:url" content={data.canonical} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Beau Robijn Fotografie" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="theme-color" content="#111111" />
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
