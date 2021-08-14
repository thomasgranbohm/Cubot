import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';
import { MessageReturnType } from '../types';
import { NowPlayingRow } from './Now';

class QueueInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'queue',
			description: 'Lists the tracks queued on this server.',
		});
	}
	run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		const subscription = subscriptions.get(interaction.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		const { queue, current } = subscription;

		if (!current) throw NotPlayingError;

		interaction.reply({
			embeds: [
				new Embed()
					.setTitle('Queue')
					.setDescription(
						[
							queue.length > 0
								? queue
										.map(
											(track, i) =>
												`\`${
													i + 1
												}.\` ${track.getInfo()}`
										)
										.join('\n')
								: 'The queue is empty.',
							`**Currently playing**\n${current.getInfo()}`,
						].join('\n\n')
					)
					.setThumbnail(current.thumbnail)
					.setFooter(
						`Track requested by ${current.requester.username}`,
						current.requester.avatarURL({
							dynamic: true,
							format: 'webp',
							size: 64,
						})
					),
			],
			components: [NowPlayingRow()],
		});
	}
}

export default QueueInteraction;
