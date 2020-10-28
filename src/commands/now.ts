import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../classes';
import { Categories } from '../config';
import { UnexpectedError } from '../errors';
import { Bot } from '../index';
import { checkBotVoice, checkUserVoice, getServerQueue, nowPlayingEmbed } from '../utils';

export class Now extends Command {
	constructor(client: Bot) {
		super(client, {
			aliases: ['np'],
			description: 'Check what is playing.',
			group: Categories.VOICE,
			guildOnly: true,
		});
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		checkUserVoice(message);
		const guildId = checkBotVoice(this.client, message);

		const [currentTrack, nextTrack] = getServerQueue(this.client, guildId);
		if (currentTrack) {
			return nowPlayingEmbed(currentTrack, nextTrack);
		}
		throw new UnexpectedError(
			'No current track found even though command passed bot voice check.'
		);
	}
}
