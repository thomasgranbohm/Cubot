import { Message } from 'discord.js';
import * as logger from '../logger';

/**
 * @param message The **message** to be sent
 * @param timeout The **timeout** in seconds until message should be deleted
 */
export default function (message: Message, timeout: number) {
	logger.debug(
		'Deleting message sent by \x1b[1m%s\x1b[0m with a timeout of \x1b[1m%is\x1b[0m',
		message.author.username,
		timeout
	);
	message.delete({
		timeout: timeout * 1000,
		reason: 'Removed by bot.',
	});
}
