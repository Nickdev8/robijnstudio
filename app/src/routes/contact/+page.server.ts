import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { readContent } from '$lib/server/content';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	const content = await readContent();
	return {
		contact: content.contact
	};
};

const DEFAULT_TO = 'nick.esselman@gmail.com';

const resolveFromAddress = () => {
	if (env.EMAIL_FROM?.trim()) {
		return env.EMAIL_FROM;
	}
	if (env.SMTP_USER?.trim()) {
	return `Beau Robijn Fotografie <${env.SMTP_USER}>`;
	}
	return undefined;
};

const createTransport = () => {
	if (env.EMAIL_TRANSPORT === 'json') {
		return nodemailer.createTransport({ jsonTransport: true });
	}

	const host = env.SMTP_HOST;
	const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : 587;
	const secure = env.SMTP_SECURE === 'true' || port === 465;
	const user = env.SMTP_USER;
	const pass = env.SMTP_PASSWORD;

	if (!host) {
		throw new Error('SMTP_HOST is not configured');
	}

	const auth = user && pass ? { user, pass } : undefined;

	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth
	});
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const email = formData.get('email');
		const packageId = formData.get('pakket');
		const message = formData.get('message');

		if (
			typeof firstName !== 'string' ||
			typeof lastName !== 'string' ||
			typeof email !== 'string' ||
			typeof packageId !== 'string' ||
			typeof message !== 'string'
		) {
			return fail(400, { error: 'Ongeldige invoer, controleer de velden en probeer opnieuw.' });
		}

		try {
			const transporter = createTransport();
			await transporter.sendMail({
				to: env.EMAIL_TO ?? DEFAULT_TO,
				from: resolveFromAddress(),
				replyTo: email,
				subject: `Nieuwe contactaanvraag van ${firstName} ${lastName}`,
				text: [
					`Naam: ${firstName} ${lastName}`,
					`E-mail: ${email}`,
					`Geselecteerd pakket: ${packageId}`,
					'---',
					message
				].join('\n'),
				html: `
					<h2>Nieuwe aanvraag via Beau Robijn Fotografie</h2>
					<p><strong>Naam:</strong> ${firstName} ${lastName}</p>
					<p><strong>E-mail:</strong> ${email}</p>
					<p><strong>Pakket:</strong> ${packageId}</p>
					<hr />
					<p>${message.replace(/\n/g, '<br />')}</p>
				`
			});
		} catch (error) {
			console.error('Kon e-mail niet verzenden', error);
			return fail(500, {
				error: 'Het verzenden is mislukt. Probeer het later opnieuw of mail direct naar info@robijnstudios.nl.'
			});
		}

		return { success: true };
	}
};
