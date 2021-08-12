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

		const { getInfo } = subscription.current;

		return {
			embeds: [
				new Embed(this)
					.setTitle('Now playing 🎶')
					.setDescription(getInfo()),
			],
		};
	}
}

export default Now;
