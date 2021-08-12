import { Message } from 'discord.js';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import { Categories } from '../constants';
import Voice from '../namespaces/Voice';

class Join extends Command {
	constructor() {
		super({
			name: 'join',
			description: 'Joins the voice channel you are in.',
			category: Categories.VOICE,
		});
	}

	async run(message: Message) {
		const channel = message.member.voice.channel;
		await Voice.create(channel);

		return {
			embeds: [new Embed(this).setTitle('Joined voice channel!')],
		};
	}
}

export default Join;
