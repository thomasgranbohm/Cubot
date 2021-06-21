import { Message, MessageEmbed } from 'discord.js';
import { MainCommand } from '../../classes';
import { Categories } from '../../config';
import { NotPlayingError } from '../../errors';
import { Bot } from '../../index';
import { checkBotVoice, checkUserVoice, getLoopEmbed } from '../../utils';
import * as subCommands from './subcommands';

export class Loop extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			aliases: ['l'],
			description: 'Make the bot loop the current track.',
			category: Categories.VOICE,
			subCommands,
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		if (args && this.subCommands.size !== 0) {
			const success = await this.handleSubCommand(message, args);
			if (!!success) return success;
		}

		await checkUserVoice(message);
		const guildId = await checkBotVoice(this.client, message);

		const server = this.client.servers.get(guildId);
		if (!server) throw new NotPlayingError();

		const newServerObject = { ...server };
		switch (server.loop) {
			case 'none':
				newServerObject.loop = 'first';
				break;
			case 'first':
				newServerObject.loop = 'all';
				break;
			case 'all':
				newServerObject.loop = 'none';
				break;
		}

		this.client.servers.set(guildId, newServerObject);

		return getLoopEmbed(newServerObject.loop);
	}
}
