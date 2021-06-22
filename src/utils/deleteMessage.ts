import { Message } from 'discord.js';

/**
 * @param message The **message** to be sent
 * @param timeout The **timeout** in seconds until message should be deleted
 */
export default async function (message: Message, timeout: number) {
	if (
		!message.guild?.me?.permissions.has('MANAGE_MESSAGES') &&
		message.author == message.guild?.me?.user
	) {
		setTimeout(async () => {
			if (!message.guild || !message.guild.me) return;

			const { me } = message.guild;
			message.reactions.cache.map((reaction) =>
				reaction.users.remove(me)
			);
		}, timeout * 1000);
		return;
	}
	console.warn(
		'\x1b[33m\x1b[1mWARN \x1b[0mDeleting message sent by \x1b[1m%s\x1b[0m with a timeout of \x1b[1m%is\x1b[0m',
		message.author.username,
		timeout
	);
	message.delete({
		timeout: timeout * 1000,
		reason: 'Removed by bot.',
	});
}
