import { Message, MessageEmbed } from "discord.js";
import { Bot } from "src";
import { PRODUCTION } from "../constants";
import { CustomError, UnexpectedError } from "../errors";

export default async function (client: Bot, error: CustomError, message: Message) {
	let { author, content, guild, channel } = message;
	let embed = error.embed || new MessageEmbed();

	if (error instanceof UnexpectedError) {
		if (PRODUCTION) {
			let developer = await client.users.fetch(client.owner);

			const DMChannel = await developer.createDM();

			DMChannel.send(
				new MessageEmbed()
					.setTitle('Ran into some problems chief')
					.setDescription(`**${author.tag}** tried to run \`${content}\` in ${guild?.name}.`)
					.addField("Developer message:", error.developerMessage)
					.addField("Stack trace:", `\`\`\`${error.stack}\`\`\``)
					.setColor('RED')
					.setTimestamp()
			);
		}
		embed.setTitle(error.name)
			.setDescription(error.message);
	} else {
		let [title, ...rest] = error.message.split("\n");

		embed.setTitle(title);

		if (rest && !embed.description) embed.setDescription(rest);
	}

	let sentMessage = await channel.send(
		embed
			.setColor('RED')
	);

	if (error.shouldBeDeleted) {
		sentMessage.delete({
			timeout: 20000
		})
	}
}