const WIDTH_PARAM_REGEX = /([?&])w=\d+/;

const appendWidthParam = (url: string, width: number): string => {
	if (WIDTH_PARAM_REGEX.test(url)) {
		return url.replace(WIDTH_PARAM_REGEX, `$1w=${width}`);
	}

	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}w=${width}`;
};

export const buildSrcSet = (url: string, widths: number[] = [480, 768, 1024, 1440]): string => {
	const cleanUrl = url.trim();
	if (!cleanUrl) return '';

	return widths
		.map((width) => `${appendWidthParam(cleanUrl, width)} ${width}w`)
		.join(', ');
};

export const defaultSizes = '(min-width: 1024px) 50vw, (min-width: 640px) 70vw, 100vw';
