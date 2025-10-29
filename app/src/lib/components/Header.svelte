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
		{ href: '/studio', label: 'Studio', match: 'startsWith' },
		{ href: '/portfolio', label: 'Portfolio', match: 'startsWith' },
		{ href: '/contact', label: 'Contact', match: 'startsWith' }
	];

	const isActive = (current: URL, item: NavItem) => {
		if (item.match === 'startsWith') {
			return current.pathname !== '/' && current.pathname.startsWith(item.href);
		}

		return current.pathname === item.href;
	};

	let isMenuOpen = false;
	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};
	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<header class="flex flex-col items-center gap-5 px-4 pt-4 sm:px-6 sm:pt-3">
	<img
		src="/logo.svg"
		alt="Logo van Beau Robijn Fotografie"
		class="h-20 sm:h-24 w-auto max-w-[min(80vw,20rem)] object-contain"
		loading="lazy"
		decoding="async"
	/>

	<div class="flex w-full max-w-6xl items-center justify-between sm:hidden">
		<button
			type="button"
			class="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
			on:click={toggleMenu}
			aria-expanded={isMenuOpen}
			aria-controls="primary-navigation"
		>
			Menu
			<span class="sr-only">open navigatie</span>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M4 7h16M4 12h16M4 17h16"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>

	<nav
		id="primary-navigation"
		class={`${
			isMenuOpen ? 'flex' : 'hidden'
		} flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white/95 px-6 py-5 text-[0.68rem] uppercase tracking-[0.24em] text-neutral-700 shadow-sm transition sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-7 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[0.72rem] sm:tracking-[0.32em] lg:gap-10 lg:text-xs lg:tracking-[0.38em]`}
	>
		{#each navItems as nav}
			{@const active = isActive($page.url, nav)}
			<a
				href={nav.href}
				aria-current={active ? 'page' : undefined}
				on:click={closeMenu}
				class={`group relative rounded-full px-3 py-2 transition-colors duration-200 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 sm:px-4 sm:py-2.5 ${
					active ? 'text-rose-700' : ''
				}`}
			>
				{nav.label}
				<span
					class={`pointer-events-none absolute left-3 right-3 bottom-1 hidden h-[1.5px] bg-rose-600 transition-all duration-300 sm:block ${
						active
							? 'opacity-100'
							: 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
					}`}
					style="transform-origin: center"
				></span>
			</a>
		{/each}
	</nav>
</header>
