import { MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import { Categories, Colors } from '../config';
import { OutgoingMessage } from '../types';

// TODO Shouldnt this use guildid
export default async function (
	channel: TextChannel | NewsChannel,
	outgoingMessage: OutgoingMessage,
	category: Categories
) {
	if (outgoingMessage instanceof MessageEmbed) {
		if (category !== undefined && category !== null) {
			outgoingMessage.setColor(Colors[category]);
		}
	}

	let sentMessage = await channel.send(outgoingMessage);

	return sentMessage;
}
