import { DMChannel, Message, MessageEmbed } from 'discord.js';
import { Categories } from '../config';
import { CustomError, UnexpectedError } from '../errors';
import { deleteFromQueue } from '../messageQueue';
import getGuildFromMessage from './getGuildFromMessage';
import sendMessage from './sendMessage';

export default async function (
	// client: Bot,
	error: CustomError,
	message: Message
) {
	const { channel, id: messageId } = message;

	if (channel instanceof DMChannel) return;

	const guild = getGuildFromMessage(message);
	const { id: guildId } = guild;

	const embed = error.embed || new MessageEmbed();

	if (error instanceof UnexpectedError) {
		// TODO Commented out for now
		// Maybe figure out a good way to send to developer.
		// if (PRODUCTION) {
		// 	const developer = await client.users.fetch(client.owner);

		// 	const DMChannel = await developer.createDM();

		// 	DMChannel.send(
		// 		new MessageEmbed()
		// 			.setTitle('Ran into some problems chief')
		// 			.setDescription(
		// 				`**${author.tag}** tried to run \`${content}\` in ${guild?.name}.`
		// 			)
		// 			.addField('Developer message:', error.developerMessage)
		// 			.addField('Stack trace:', `\`\`\`${error.stack}\`\`\``)
		// 			.setColor(Colors[Categories.ERROR])
		// 			.setTimestamp()
		// 	);
		// } else {
		console.error(error);
		// }
		embed.setTitle(error.name).setDescription(error.message);
	} else {
		const [title, ...rest] = error.message.split('\n');

		embed.setTitle(title);

		if (rest && !embed.description) embed.setDescription(rest);
	}

	deleteFromQueue(guildId, messageId);
	sendMessage(channel, embed, Categories.ERROR);
}
