import { Message, MessageEmbed } from 'discord.js';
import { MainCommand, SubCommand } from '../../classes';
import * as eqs from '../../equalizers';
import { Bot } from '../../index';
import { getGuildFromMessage } from '../../utils';

export class List extends SubCommand {
	constructor(client: Bot, parentCommand: MainCommand) {
		super(client, parentCommand, {
			aliases: ['l'],
			description: 'Lists all available equalizers',
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		let embed = new MessageEmbed()
			.setTitle('List of all equalizers')
			.setDescription(
				Object.entries(eqs).map(
					([name, e]) =>
						`**${name}** – ${e.description}`
				)
			);

		const guild = getGuildFromMessage(message);
		if (guild) {
			const server = this.client.servers.get(guild.id);
			if (server) {
				embed.setDescription(
					[
						embed.description,
						`**Current:** ${
							server?.equalizer?.name ||
							eqs.flat.name
						}`,
					].join('\n\n')
				);
			}
		}

		return embed;
	}
}
