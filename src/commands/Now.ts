import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError } from '../errors';
import { MessageReturnType } from '../types';

class Now extends Command {
	constructor() {
		super({
			name: 'now',
			description: 'Displays the currently playing song.',
			aliases: ['np'],
			category: Categories.VOICE,
		});
	}

	async run(message: Message): Promise<MessageReturnType> {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		return {
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
		};
	}
}

export default Now;
