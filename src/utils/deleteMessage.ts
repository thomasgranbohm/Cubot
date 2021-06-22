import { Message } from 'discord.js';
import { hasSpecificPermission } from './checkPermissions';
import getGuildFromMessage from './getGuildFromMessage';

/**
 * @param message The **message** to be sent
 * @param timeout The **timeout** in seconds until message should be deleted
 */
export default async function (message: Message, timeout: number) {
	const guild = getGuildFromMessage(message);
	if (!hasSpecificPermission(guild, 'MANAGE_MESSAGES')) {
		if (message.author == message.guild?.me?.user) {
			setTimeout(async () => {
				if (!guild || !guild.me) return;

				const { me } = guild;
				message.reactions.cache.map((reaction) =>
					reaction.users.remove(me)
				);
			}, timeout * 1000);
		}
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
