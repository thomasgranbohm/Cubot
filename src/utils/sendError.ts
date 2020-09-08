import { Message, MessageEmbed } from "discord.js";
import { Bot } from "src";
import * as errors from "../errors"

export default async function (client: Bot, error: Error, message: Message) {
	let { author, content, guild, channel } = message;

	let embed = new MessageEmbed()
		.setColor('RED');;
	const isDefinedError = Object.values(errors).some((e) => (error instanceof e));
	if (isDefinedError) {
		embed
			.setTitle(error.message);
	} else {
		if (process.env.NODE_ENV === 'production') {
			let developer = await client.users.fetch(client.owner);
			const DMChannel = await developer.createDM();
			DMChannel.send(
				new MessageEmbed()
					.setTitle('Ran into some problems chief')
					.setDescription(`**${author.tag}** tried to run \`${content}\` in ${guild?.name}.\n\nHere is the stack trace:\n\`\`\`${error.stack}\`\`\``)
					.setColor('RED')
					.setTimestamp()
			);
		}
		embed.setTitle("Oops, an actual error...")
			.setDescription("Sorry about that. Please try again!\nReoccurring issue? [Please report it!](https://github.com/thomasgranbohm/CuBot/issues)")
	}
	let sentMessage = await channel.send(embed);

	sentMessage.delete({
		timeout: 10000
	})
}