import { MessageEmbed, User, TextChannel, DMChannel, NewsChannel } from "discord.js";
import getUserAvatar from "./getUserAvatar";
import { Categories } from "../config";

export default async function (channel: TextChannel | DMChannel | NewsChannel, message: MessageEmbed | string | Error, category?: string, author?: User) {
	if (message instanceof MessageEmbed) {
		if (category)
			message.setColor(category)
		if (!message.footer && !message.timestamp && category !== Categories.ADMIN && author) {
			message.setFooter(
				`Requested by ${author.username}`,
				getUserAvatar(author)
			);
		}
	}

	let sentMessage = await channel.send(message);

	if (author && channel instanceof DMChannel !== true) {
		sentMessage.delete({ timeout: 15000 });
	}
}