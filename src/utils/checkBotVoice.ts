import { Message } from 'discord.js';
import { Bot } from 'src';
import { BotNotInVoiceError, NoGuildFoundError, NotPlayingError } from '../errors';
import getServerQueue from './getServerQueue';

export default function (client: Bot, message: Message): string {
	const guildId = message.guild?.id;
	if (!guildId) throw new NoGuildFoundError();

	if (!client.manager.players.get(guildId)) throw new BotNotInVoiceError();

	let queue = getServerQueue(client, guildId);
	if (!queue || queue.length == 0) throw new NotPlayingError();

	return guildId;
}
