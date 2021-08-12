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

		if (subscription.queue.length === 0) throw NotPlayingError;

		return {
			embeds: [
				new Embed(this)
					.setTitle('Queue')
					.setDescription(
						[
							subscription.current.getInfo(),
							subscription.queue
								.map(
									({ getInfo }, i) =>
										`\`${i + 1}.\` ${getInfo()}`
								)
								.join('\n'),
						].join('\n\n')
					),
			],
		};
	}
}

export default Queue;
