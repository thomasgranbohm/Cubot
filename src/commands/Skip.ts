import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';

class Skip extends Command {
	constructor() {
		super({
			name: 'skip',
			description: 'Skips the playing track.',
			aliases: ['s'],
			category: Categories.VOICE,
		});
	}

	run(message: Message) {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		if (!subscription.current) throw NotPlayingError;

		subscription.player.stop();
	}
}

export default Skip;
