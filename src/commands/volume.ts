import { Message, MessageEmbed } from 'discord.js';
import { MainCommand } from '../classes';
import { Categories } from '../config';
import { UPPER_VOLUME_LIMIT } from '../constants';
import { NotPlayingError, VolumeNotBetweenThresholdError } from '../errors';
import { Bot } from '../index';
import { checkBotVoice, checkUserVoice } from '../utils';

export class Volume extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			aliases: ['vol', 'v'],
			description: 'Change the volume of the playing track.',
			category: Categories.VOICE,
			guildOnly: true,
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		let guildId = await checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId);
		if (!player) throw new NotPlayingError();

		const currentVolume = player.state.volume;

		let embed = new MessageEmbed();
		if (args && args.length !== 0) {
			const first = args.pop() || '0';
			const shouldAdd = first?.startsWith('+');
			const shouldRemove = first?.startsWith('-');

			const currentVolume = await player.state.volume;

			let newVolume = 0;
			if (shouldAdd || shouldRemove) {
				newVolume = currentVolume + parseInt(first);
			} else {
				newVolume = parseInt(first);
			}

			if (
				newVolume === NaN ||
				newVolume > UPPER_VOLUME_LIMIT ||
				newVolume < 0
			)
				throw new VolumeNotBetweenThresholdError();

			await player.volume(newVolume);
			embed
				.setTitle('Changed volume')
				.setDescription(`From ${currentVolume} to ${newVolume}!`);
		} else {
			embed
				.setTitle('Current volume')
				.setDescription(`${currentVolume}%`);
		}

		return embed;
	}
}
