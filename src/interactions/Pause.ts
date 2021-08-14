import { AudioPlayerStatus } from '@discordjs/voice';
import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import CustomInteraction from '../classes/Interaction';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';
import { MessageReturnType } from '../types';
import { NowPlayingRow } from './Now';

class PauseInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'pause',
			description: 'Pauses the playing track.',
		});
	}

	run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		const subscription = subscriptions.get(interaction.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		if (!subscription.current) throw NotPlayingError;

		if (subscription.player.state.status === AudioPlayerStatus.Paused) {
			subscription.player.unpause();
		} else if (
			subscription.player.state.status === AudioPlayerStatus.Playing
		) {
			subscription.player.pause(true);
		} else throw NotPlayingError;

		if (interaction instanceof ButtonInteraction) {
			interaction.update({
				components: [
					NowPlayingRow(
						subscription.player.state.status ===
							AudioPlayerStatus.Paused
					),
				],
			});
		}
	}
}

export default PauseInteraction;
