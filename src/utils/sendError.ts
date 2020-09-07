import { Message, MessageEmbed } from "discord.js";
import { Bot } from "src";

export default async function (client: Bot, error: Error, message: Message) {
	let { author, content, guild, channel } = message;
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
	console.error(error)
	let sentMessage = await channel.send(
		new MessageEmbed()
			.setTitle("Oops, an actual error...")
			.setDescription("Sorry about that. Please try again!")
			.attachFiles([
				{ attachment: `${process.cwd()}/static/error.png`, name: `error.png` }
			])
			.setColor('RED')
			.setThumbnail('attachment://error.png')
	);

	sentMessage.delete({
		timeout: 10000
	})
}