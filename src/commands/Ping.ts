import { Message, MessageActionRow, MessageButton } from 'discord.js';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';

class Ping extends Command {
	constructor() {
		super({
			name: 'ping',
			description: 'You know, ping pong!',
			category: Categories.MISC,
			needs_arguments: false,
		});
	}

	async run(message: Message) {
		console.log(message.client.emojis.resolve(`<:`));
		return {
			embeds: [new Embed(this).setTitle(':ping_pong: Ping!')],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton({
						customId: this.name,
						style: 'PRIMARY',
						emoji: '<a:clap:410582327081697292>',
						label: 'vin.',
					})
				),
			],
		};
	}
}

export default Ping;
