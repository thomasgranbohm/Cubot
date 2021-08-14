import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { BotNotInVoiceChannelError } from '../errors';
import { MessageReturnType } from '../types';

class LoopInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'loop',
			description: 'Make the bot loop the current track.',
			options: [
				{
					name: 'all',
					type: 'SUB_COMMAND',
					description: 'Loop entire queue',
				},
				{
					name: 'first',
					type: 'SUB_COMMAND',
					description: 'Loop first track',
				},
				{
					name: 'none',
					type: 'SUB_COMMAND',
					description: "Don't loop any track",
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

		const next_loop = interaction.options.getSubcommand() as
			| 'all'
			| 'first'
			| 'none';
		const loop = subscription.setLoop(next_loop);

		interaction.reply({
			embeds: [new Embed().setTitle(`Looping ${loop}.`)],
		});
	}
}

export default LoopInteraction;
