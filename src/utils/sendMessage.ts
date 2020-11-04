import {
	DMChannel,
	MessageEmbed,
	NewsChannel,
	TextChannel,
	User,
} from 'discord.js';
import { Categories } from '../config';

export default async function (
	channel: TextChannel | DMChannel | NewsChannel,
	pendingMessage: MessageEmbed | string | Error,
	category?: string,
	author?: User
) {
	if (pendingMessage instanceof MessageEmbed) {
		if (category !== undefined && category !== null) {
			pendingMessage.setColor(
				Object.values(Categories).find(
					(value) => value === category
				) || Categories.ERROR
			);
		}
	}

	const sentMessage = await channel.send(pendingMessage);

	return sentMessage;
}
