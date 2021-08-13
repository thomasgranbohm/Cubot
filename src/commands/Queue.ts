import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';

class Queue extends Command {
	constructor() {
		super({
			name: 'queue',
			description: 'Displays the tracks in the queue.',
			aliases: ['q'],
			category: Categories.VOICE,
		});
	}

	run(message: Message) {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		const { queue, current } = subscription;

		if (!current) throw NotPlayingError;

		return {
			embeds: [
				new Embed(this)
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
		};
	}
}

export default Queue;
