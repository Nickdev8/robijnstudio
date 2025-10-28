<script lang="ts">
	import { page } from '$app/stores';

	type NavItem = {
		href: string;
		label: string;
		match?: 'exact' | 'startsWith';
	};

	const navItems: NavItem[] = [
		{ href: '/', label: 'Home', match: 'exact' },
		{ href: '/about', label: 'Over', match: 'startsWith' },
		{ href: '/portfolio', label: 'Portfolio', match: 'startsWith' },
		{ href: '/contact', label: 'Contact', match: 'startsWith' }
	];

	const isActive = (current: URL, item: NavItem) => {
		if (item.match === 'startsWith') {
			return current.pathname !== '/' && current.pathname.startsWith(item.href);
		}

		return current.pathname === item.href;
	};
</script>

<header class="flex flex-col items-center gap-6 px-6 pt-12">
	<img
		src="/logo.svg"
		alt="Logo van Beau Robijn Studios"
		class="h-24 w-24"
		loading="lazy"
		decoding="async"
	/>

	<nav class="font-lifted flex flex-wrap items-center justify-center gap-10 text-xs uppercase text-neutral-600">
		{#each navItems as nav}
			{@const active = isActive($page.url, nav)}
			<a
				href={nav.href}
				aria-current={active ? 'page' : undefined}
				class={`group relative pb-2 transition-colors duration-200 hover:text-black ${active ? 'text-black' : ''}`}
			>
				{nav.label}
				<span
					class={`pointer-events-none absolute inset-x-0 -bottom-0.5 hidden h-px bg-neutral-800 transition-opacity duration-200 sm:block ${
						active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
					}`}
				></span>
			</a>
		{/each}
	</nav>
</header>
