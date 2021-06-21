import { Collection, Message, MessageEmbed } from 'discord.js';
import { MainCommand } from '../classes';
import { Categories } from '../config';
import { Bot } from '../index';
import { getGuildFromMessage } from '../utils/';

export class Help extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			aliases: ['h'],
			description: 'Gets help about a command or command category, or a list of all commands.',
			category: Categories.MISC,
			examples: ['<command>', '<category>'],
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		const getHelpMessage = (
			commands: Collection<String, MainCommand> = this.client.commands
		) => {
			return [
				commands
					.sort((a, b) => {
						let aName = a.names.slice().shift(),
							bName = b.names.slice().shift();
						if (!aName || !bName) return 0;

						if (aName > bName) return 1;
						else if (aName < bName) return -1;
						return 0;
					})
					.map((command) => command.help(prefix) as string),
				[
					`**Prefix in this guild:** \`${prefix}\``,
					`**Available categories:** ${this.client.categories
						.sort()
						.map((category) => `\`${category.toLowerCase()}\``)
						.join(', ')}`,
				],
			]
				.map((arr) => arr.join('\n'))
				.join('\n\n');
		};

		let guild = getGuildFromMessage(message);
		const prefix = await this.client.guildResolver.prefix(guild.id);

		const wanted = args?.shift();
		if (!!wanted) {
			const command = this.client.commands.find((c) =>
				c.names.includes(wanted)
			);
			if (command instanceof MainCommand) {
				const wantedSubCommand = args?.shift();
				if (
					!!wantedSubCommand &&
					!!command.subCommands &&
					!!command.subCommands.get(wantedSubCommand)
				) {
					return command.help(prefix, true, wantedSubCommand);
				} else {
					return command.help(prefix, true);
				}
			}
			const category = this.client.categories.find(
				(category) => category.toLowerCase() === wanted.toLowerCase()
			);
			if (!!category) {
				return new MessageEmbed()
					.setTitle(
						`List of every \`${category.toLowerCase()}\` command:`
					)
					.setDescription(
						getHelpMessage(
							this.client.commands.filter(
								(c) => c.category === category
							)
						)
					);
			}
		}

		return new MessageEmbed()
			.setTitle('List of all commands:')
			.setDescription(getHelpMessage());
	}
}
