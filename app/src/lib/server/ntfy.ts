import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

type NotificationPayload = {
	title: string;
	message?: string;
	tags?: string[];
	priority?: 1 | 2 | 3 | 4 | 5;
};

const trim = (value: string | undefined | null) => value?.trim() ?? '';

const rawTopicUrl = trim(env.NTFY_TOPIC_URL);
const rawTopic = trim(env.NTFY_TOPIC);
const baseUrl = (trim(env.NTFY_BASE_URL) || 'https://ntfy.sh').replace(/\/+$/, '');
const resolvedTopicUrl = rawTopicUrl || (rawTopic ? `${baseUrl}/${rawTopic}` : undefined);
const authToken = trim(env.NTFY_AUTH_TOKEN);

const resolvedIconUrl = trim(env.NTFY_ICON_URL) || resolveDefaultIconUrl();

export const isNtfyConfigured = Boolean(resolvedTopicUrl);

export async function sendNtfyNotification(payload: NotificationPayload): Promise<void> {
	if (!resolvedTopicUrl) {
		return;
	}

	const headers: Record<string, string> = {
		Title: payload.title,
		'Content-Type': 'text/plain; charset=utf-8'
	};

	if (payload.tags?.length) {
		headers.Tags = payload.tags.join(',');
	}

	if (payload.priority) {
		headers.Priority = payload.priority.toString();
	}

	if (authToken) {
		headers.Authorization = `Bearer ${authToken}`;
	}

	if (resolvedIconUrl) {
		headers['X-Icon'] = resolvedIconUrl;
	}

	try {
		const response = await fetch(resolvedTopicUrl, {
			method: 'POST',
			headers,
			body: payload.message ?? ''
		});

		if (!response.ok) {
			const detail = await response.text();
			console.error('ntfy notification failed', response.status, detail);
		}
	} catch (error) {
		console.error('ntfy notification error', error);
	}
}

function resolveDefaultIconUrl(): string | undefined {
	const siteUrl =
		trim(publicEnv.PUBLIC_SITE_URL) ||
		trim(env.SITE_URL) ||
		trim(env.BASE_URL) ||
		trim(env.PUBLIC_SITE_URL);

	if (!siteUrl) {
		return undefined;
	}

	return `${siteUrl.replace(/\/+$/, '')}/ruby.png`;
}


