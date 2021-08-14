import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { BotNotInVoiceChannelError, NotPlayingError } from '../errors';
import { MessageReturnType } from '../types';

class SkipInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'skip',
			description: 'Skips the playing track.',
		});
	}

	run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		const subscription = subscriptions.get(interaction.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		if (!subscription.current) throw NotPlayingError;

		if (interaction.isCommand()) {
			if (interaction.options.get('all')) subscription.queue = [];
		}

		interaction.reply({
			embeds: [
				new Embed()
					.setTitle('Skipped ⏩')
					.setDescription(subscription.current.getInfo())
					.setThumbnail(subscription.current.thumbnail)
					.setFooter(
						`Skipped by ${interaction.user.username}`,
						interaction.user.avatarURL()
					),
			],
		});

		subscription.player.stop();
	}
}

export default SkipInteraction;
