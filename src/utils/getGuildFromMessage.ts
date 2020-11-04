import { Guild, Message } from 'discord.js';
import { UnexpectedError } from '../errors';
/**
 * @param message The message to get the guild from
 * @returns {Guild} the guild in which the message was sent
 * @throws UnexpectedError if message doesnt have guild
 */
export default function (message: Message): Guild {
	let { guild } = message;
	if (!guild)
		throw new UnexpectedError('Message didnt have guild');
	return guild;
}
