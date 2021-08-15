import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { BotNotInVoiceChannelError } from '../errors';
import { MessageReturnType } from '../types';

class VolumeInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'volume',
			description: 'Change the volume of the bot.',
			options: [
				{
					name: 'amount',
					type: 'NUMBER',
					description: 'The new volume level.',
					required: true,
				},
			],
		});
	}
	run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		if (!interaction.isCommand()) return;
		const subscription = subscriptions.get(interaction.guildId);
		if (!subscription) throw BotNotInVoiceChannelError;

		const new_volume = interaction.options.get('amount');
		if (Number(new_volume)) {
			subscription.setVolume(Number(new_volume));

			interaction.reply({
				embeds: [new Embed().setTitle(`New volume: ${new_volume}`)],
			});
		}
	}
}

export default VolumeInteraction;
