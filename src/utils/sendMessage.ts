import { MessageEmbed, User, TextChannel, DMChannel, NewsChannel } from "discord.js";
import { Categories } from "../types";
import getUserAvatar from "./getUserAvatar";

export default async function (channel: TextChannel | DMChannel | NewsChannel, message: MessageEmbed | Error, category: string, author: User | null = null) {
	if (message instanceof MessageEmbed) {
		message.setColor(category)
		if (!message.footer && !message.timestamp && category !== Categories.ADMIN && author) {
			message.setFooter(
				`Requested by ${author.username}`,
				getUserAvatar(author)
			);
		}
	}

	if (message instanceof Error) {
		console.error(message)
		message = new MessageEmbed()
			.setTitle(message.message)
			// .setDescription(`\`\`\`${message.stack}\`\`\``)
			.setColor('RED');
	}

	let sentMessage = await channel.send(message);

	if (author && channel instanceof DMChannel !== true) {
		sentMessage.delete({ timeout: 15000 });
	}
}