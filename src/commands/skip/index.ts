import { Message, MessageEmbed } from 'discord.js';
import { MainCommand } from '../../classes';
import { Categories } from '../../config';
import { NotPlayingError } from '../../errors';
import { Bot } from '../../index';
import {
	checkBotVoice,
	checkUserVoice,
	getServerQueue,
	nowPlayingEmbed,
} from '../../utils';
import * as subCommands from './subcommands';

export class Skip extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			aliases: ['s'],
			description: 'Skips the playing track.',
			group: Categories.VOICE,
			guildOnly: true,
			subCommands,
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		if (args && this.subCommands.size !== 0) {
			const success = await this.handleSubCommand(
				message,
				args
			);
			if (!!success) return success;
		}

		await checkUserVoice(message);
		const guildId = await checkBotVoice(
			this.client,
			message
		);

		const player = this.client.manager.players.get(guildId);
		if (!player) throw new NotPlayingError();

		const queue = getServerQueue(this.client, guildId);
		const nextTrack = queue.slice(1).shift();
		await player.stop();

		if (nextTrack) return nowPlayingEmbed(nextTrack);
		return new MessageEmbed().setTitle('And now, silence.');
	}
}
