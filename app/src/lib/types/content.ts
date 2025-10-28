export type CTAItem = {
	title: string;
	description: string;
	href: string;
};

export type HomeContent = {
	tagline: string;
	title: string;
	subtitle: string;
	description: string;
	heroImage: { src: string; alt: string };
	heroLabel: string;
	cta: CTAItem[];
	availability: string;
};

export type StatItem = {
	label: string;
	value: string;
};

export type ProjectItem = {
	slug: string;
	title: string;
	description: string;
	result?: string;
	videoUrl?: string;
	heroImage: { src: string; alt: string };
	body: string[];
	externalUrl?: string;
};

export type Testimonial = {
	quote: string;
	source: string;
};

export type AboutContent = {
	introTag: string;
	headline: string;
	paragraphs: string[];
	stats: StatItem[];
	projects: ProjectItem[];
	testimonials: Testimonial[];
	portrait: { src: string; alt: string };
};

export type GalleryItem = {
	src: string;
	alt: string;
	size: 'square' | 'wide' | 'tall';
};

export type PortfolioContent = {
	tagline: string;
	description: string;
	gallery: GalleryItem[];
};

export type PackageItem = {
	id: string;
	title: string;
	description: string;
	price: string;
};

export type ContactContent = {
	tagline: string;
	description: string;
	bullets: string[];
	packages: PackageItem[];
	outro: string;
	email: string;
};

export type SiteContent = {
	home: HomeContent;
	about: AboutContent;
	portfolio: PortfolioContent;
	contact: ContactContent;
};
