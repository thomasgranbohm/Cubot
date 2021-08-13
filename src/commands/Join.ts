import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import Subscription from '../classes/Subscription';
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
		const connection = await Voice.create(channel);

		subscriptions.set(message.guildId, new Subscription(connection));

		return {
			embeds: [new Embed(this).setTitle('Joined voice channel!')],
		};
	}
}

export default Join;
