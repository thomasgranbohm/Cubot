import { AudioPlayerStatus } from '@discordjs/voice';
import {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError } from '../errors';
import { MessageReturnType } from '../types';

export const NowPlayingRow = (paused?: boolean) =>
	new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('pause')
			.setLabel(paused ? 'Resume' : 'Pause')
			.setStyle('SECONDARY')
			.setEmoji(paused ? '▶' : '⏸'),
		new MessageButton()
			.setCustomId('skip')
			.setLabel('Skip')
			.setStyle('SECONDARY')
			.setEmoji('⏭️')
	);

class NowInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'np',
			description: 'Check what track is playing.',
			category: Categories.VOICE,
		});
	}
	run(
		interaction: CommandInteraction | ButtonInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		const subscription = subscriptions.get(interaction.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		interaction.reply({
			embeds: [
				new Embed(this)
					.setTitle('Now playing 🎶')
					.setDescription(subscription.current.getInfo())
					.setThumbnail(subscription.current.thumbnail)
					.setFooter(
						`Track requested by ${subscription.current.requester.username}`,
						subscription.current.requester.avatarURL({
							dynamic: true,
							format: 'webp',
							size: 64,
						})
					),
			],
			components: [
				NowPlayingRow(
					subscription.player.state.status ===
						AudioPlayerStatus.Paused
				),
			],
		});
	}
}

export default NowInteraction;
