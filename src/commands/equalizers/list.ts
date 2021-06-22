import { Message, MessageEmbed } from 'discord.js';
import { CustomEmbed, MainCommand, SubCommand } from '../../classes';
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
		const guild = getGuildFromMessage(message);

		const embed = new CustomEmbed({ guild })
			.setTitle('List of all equalizers')
			.setDescription(
				Object.entries(eqs).map(
					([name, e]) => `**${name}** – ${e.description}`
				)
			);

		if (guild) {
			const server = this.client.servers.get(guild.id);
			if (server) {
				embed.setFixedDescription(
					`**Current:** \`${
						server?.equalizer?.name || eqs.flat.name
					}\``
				);
			}
		}

		return embed;
	}
}
