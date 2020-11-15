import { MessageEmbed } from 'discord.js';
import { QueueEntry } from 'src/types';
import { Colors } from '../config';

// TODO Shouldnt this use guildid
export default async function (queueEntry: QueueEntry) {
	const { category, channel, pendingMessage } = queueEntry;

	if (pendingMessage instanceof MessageEmbed) {
		if (category !== undefined && category !== null) {
			pendingMessage.setColor(Colors[category]);
		}
	}

	let sentMessage = await channel.send(pendingMessage);

	return sentMessage;
}
