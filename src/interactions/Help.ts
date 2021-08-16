import { ButtonInteraction, CommandInteraction } from 'discord.js';
import { interactions, prefix } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import { Categories } from '../constants';
import { MessageReturnType } from '../types';

class HelpInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'help',
			description: 'Displays the available commands.',
			category: Categories.MISC,
		});
	}
	run(
		interaction: ButtonInteraction | CommandInteraction
	): MessageReturnType | Promise<MessageReturnType> {
		if (!interaction.isCommand()) return;

		interaction.reply({
			embeds: [
				new Embed(this)
					.setTitle('List of all commands:')
					.setDescription(
						[
							interactions
								.sort((a, b) => a.name.localeCompare(b.name))
								.map((v) => `**${v.name}** - ${v.description}`)
								.join('\n'),
							`**Prefix in this guild:** \`${prefix}\``,
						].join('\n\n')
					),
			],
		});
	}
}

export default HelpInteraction;
