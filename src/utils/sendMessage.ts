import { DMChannel, MessageEmbed, NewsChannel, TextChannel, User } from "discord.js";
import { Categories, Colors } from "../config";

export default async function (channel: TextChannel | DMChannel | NewsChannel, pendingMessage: MessageEmbed | string | Error, category?: Categories, author?: User) {
	if (pendingMessage instanceof MessageEmbed) {
		if (category)
			pendingMessage.setColor(Colors[category])
	}

	let sentMessage = await channel.send(pendingMessage);

	return sentMessage;
}