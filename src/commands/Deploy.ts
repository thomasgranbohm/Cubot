import { Message } from 'discord.js';
import { interactions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';

class Deploy extends Command {
	constructor() {
		super({
			name: 'deploy',
			aliases: ['d'],
			category: Categories.UTILS,
			description: 'Deploys the bot and enables slash commands.',
		});
	}

	async run(message: Message) {
		await message.guild.commands.set(interactions.map((value) => value));

		return {
			embeds: [new Embed(this).setTitle('Deployed bot!')],
		};
	}
}

export default Deploy;
