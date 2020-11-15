import { DMChannel, Message, MessageEmbed } from 'discord.js';
import { Bot } from 'src';
import { Categories, Colors } from '../config';
import { PRODUCTION } from '../constants';
import { CustomError, UnexpectedError } from '../errors';
import { updateMessageQueue } from '../messageQueue';
import getGuildFromMessage from './getGuildFromMessage';

export default async function (
	client: Bot,
	error: CustomError,
	message: Message
) {
	const { author, content, channel, id: messageId } = message;

	if (channel instanceof DMChannel) return;

	const guild = getGuildFromMessage(message);
	const { id: guildId } = guild;

	const embed = error.embed || new MessageEmbed();

	if (error instanceof UnexpectedError) {
		if (PRODUCTION) {
			const developer = await client.users.fetch(client.owner);

			const DMChannel = await developer.createDM();

			DMChannel.send(
				new MessageEmbed()
					.setTitle('Ran into some problems chief')
					.setDescription(
						`**${author.tag}** tried to run \`${content}\` in ${guild?.name}.`
					)
					.addField('Developer message:', error.developerMessage)
					.addField('Stack trace:', `\`\`\`${error.stack}\`\`\``)
					.setColor(Colors[Categories.ERROR])
					.setTimestamp()
			);
		} else {
			console.error(error);
		}
		embed.setTitle(error.name).setDescription(error.message);
	} else {
		const [title, ...rest] = error.message.split('\n');

		embed.setTitle(title);

		if (rest && !embed.description) embed.setDescription(rest);
	}

	updateMessageQueue(guildId, messageId, {
		channel,
		pendingMessage: embed,
		category: Categories.ERROR,
	});
}
