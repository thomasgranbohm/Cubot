import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError } from '../errors';

class Loop extends Command {
	constructor() {
		super({
			name: 'loop',
			description: 'Make the bot loop the current track.',
			category: Categories.VOICE,
			aliases: ['l'],
		});
	}

	run(message: Message) {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		const loop = subscription.setLoop('all');

		return {
			embeds: [
				new Embed(this).setTitle(
					loop === 'all'
						? 'Looping entire queue'
						: loop === 'first'
						? 'Looping first track'
						: 'Not looping'
				),
			],
		};
	}
}

export default Loop;
