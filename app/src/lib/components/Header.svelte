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

<header class="flex flex-col items-center gap-6 px-4 pt-10 sm:px-6 sm:pt-12">
		<img
			src="/logo.svg"
			alt="Logo van Beau Robijn Fotografie"
			class="h-20 sm:h-24 w-auto max-w-[min(80vw,20rem)] object-contain"
			loading="lazy"
			decoding="async"
		/>

	<nav
		class="flex flex-wrap items-center justify-center gap-4 text-[0.68rem] uppercase tracking-[0.32em] text-neutral-600 sm:gap-7 sm:text-[0.72rem] sm:tracking-[0.38em] lg:gap-10 lg:text-xs lg:tracking-[0.42em]"
	>
		{#each navItems as nav}
			{@const active = isActive($page.url, nav)}
			<a
				href={nav.href}
				aria-current={active ? 'page' : undefined}
				class={`group relative pb-2 transition-colors duration-200 hover:text-rose-700 ${active ? 'text-rose-700' : ''}`}
			>
				{nav.label}
				<span
					class={`pointer-events-none absolute inset-x-0 -bottom-0.5 hidden h-px bg-rose-600 transition-opacity duration-200 sm:block ${
						active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
					}`}
				></span>
			</a>
		{/each}
	</nav>
</header>
