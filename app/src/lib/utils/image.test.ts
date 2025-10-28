import { describe, expect, it } from 'vitest';
import { buildSrcSet } from './image';

describe('buildSrcSet', () => {
	it('creates srcset entries replacing existing width parameter', () => {
		const src = 'https://images.example.com/sample.jpg?auto=format&fit=crop&w=1100&q=80';
		const result = buildSrcSet(src, [480, 768, 1024]);
		const entries = result.split(', ');
		expect(entries).toHaveLength(3);
		expect(entries[0]).toMatch(/w=480/);
		expect(entries[0]).toMatch(/480w$/);
		expect(entries[1]).toMatch(/w=768/);
		expect(entries[2]).toMatch(/w=1024/);
	});

	it('appends width parameter when missing', () => {
		const src = 'https://assets.example.com/photo.png';
		const result = buildSrcSet(src, [320, 640]);
		expect(result).toBe('https://assets.example.com/photo.png?w=320 320w, https://assets.example.com/photo.png?w=640 640w');
	});

	it('returns empty string for empty input', () => {
		expect(buildSrcSet('')).toBe('');
	});
});
