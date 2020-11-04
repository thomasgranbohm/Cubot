import { Message, MessageEmbed } from 'discord.js';
import { MainCommand, SubCommand } from '../../classes';
import { NotPlayingError } from '../../errors';
import { Bot } from '../../index';
import { ServerObject } from '../../types';
import {
	checkBotVoice,
	checkUserVoice,
	getLoopEmbed,
} from '../../utils';

export class All extends SubCommand {
	constructor(client: Bot, parentCommand: MainCommand) {
		super(client, parentCommand, {
			aliases: ['e', 'a'],
			description: 'Loop entire queue.',
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		const guildId = await checkBotVoice(
			this.client,
			message
		);

		const server = this.client.servers.get(guildId);
		if (!server) throw new NotPlayingError();

		const newServerObject: ServerObject = {
			...server,
			loop: server.loop === 'all' ? 'none' : 'all',
		};
		this.client.servers.set(guildId, newServerObject);

		return getLoopEmbed(newServerObject.loop);
	}
}
