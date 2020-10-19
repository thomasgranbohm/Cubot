import { Message, MessageEmbed } from "discord.js";
import { Bot } from "src";
import { Categories, Colors } from "../config";
import { BOT_MESSAGE_DELETE_TIMEOUT, PRODUCTION } from "../constants";
import { CustomError, UnexpectedError } from "../errors";
import deleteMessage from "./deleteMessage";
import sendMessage from "./sendMessage";

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
					.setColor(Colors[Categories.ERROR])
					.setTimestamp()
			);
		}
		embed.setTitle(error.name)
			.setDescription(error.message);
	} else {
		let [title, ...rest] = error.message.split("\n");

		embed.setTitle(title);

		if (rest && !embed.description)
			embed.setDescription(rest);
	}

	let sentMessage = await sendMessage(channel, embed, Categories.ERROR)

	if (!error.shouldBeDeleted) return;

	deleteMessage(
		sentMessage,
		BOT_MESSAGE_DELETE_TIMEOUT
	);
}