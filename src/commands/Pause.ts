import { AudioPlayerStatus } from '@discordjs/voice';
import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';

class Pause extends Command {
	constructor() {
		super({
			name: 'pause',
			description: 'Pauses or unpauses the playing track.',
			category: Categories.VOICE,
		});
	}

	run(message: Message) {
		const subscription = subscriptions.get(message.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		if (subscription.player.state.status === AudioPlayerStatus.Paused) {
			subscription.player.unpause();
			return {
				embeds: [new Embed(this).setTitle('Playing!')],
			};
		} else if (
			subscription.player.state.status === AudioPlayerStatus.Playing
		) {
			subscription.player.pause(true);
			return {
				embeds: [new Embed(this).setTitle('Paused!')],
			};
		} else throw NotPlayingError;
	}
}

export default Pause;
