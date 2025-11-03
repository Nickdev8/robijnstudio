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



export type Testimonial = {
	quote: string;
	source: string;
};

export type AboutProject = {
	slug: string;
	title: string;
	description: string;
	result?: string;
	videoUrl?: string;
	heroImage: { src: string; alt: string };
	body: string[];
	externalUrl?: string;
};

export type StudioImage = {
	src: string;
	alt: string;
};

export type StudioScheduleItem = {
	day: string;
	hours: string;
};

export type AboutContent = {
	introTag: string;
	headline: string;
	paragraphs: string[];
	stats: StatItem[];
	projects: AboutProject[];
	testimonials: Testimonial[];
	testimonialsLabel?: string;
	testimonialsHeading?: string;
	testimonialsDescription?: string;
	portrait: { src: string; alt: string };
};

export type StudioContent = {
	title: string;
	subtitle: string;
	tagline: string;
	address: {
		label: string;
		lines: string[];
		mapUrl?: string;
	};
	contactEmail: string;
	contactLabel: string;
	contactDescription: string;
	contactCtaHeading: string;
	contactPrimaryLabel: string;
	photos: StudioImage[];
	rubyImage: StudioImage;
	portrait: StudioImage;
	scheduleLabel: string;
	scheduleIntro?: string;
	schedule: StudioScheduleItem[];
	scheduleNote?: string;
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
	studio: StudioContent;
	portfolio: PortfolioContent;
	contact: ContactContent;
};
