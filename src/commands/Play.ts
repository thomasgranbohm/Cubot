import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import Subscription from '../classes/Subscription';
import Track from '../classes/Track';
import { Categories } from '../constants';
import Messaging from '../namespaces/Messaging';
import Voice from '../namespaces/Voice';
import { MessageReturnType } from '../types';

let i = 0;

class Play extends Command {
	constructor() {
		super({
			name: 'play',
			description: 'Plays the track inputted.',
			category: Categories.VOICE,
			aliases: ['p'],
			needs_arguments: true,
		});
	}

	async run(message: Message): Promise<MessageReturnType | null> {
		let subscription = subscriptions.get(message.guildId);
		if (!subscription) {
			if (message.member.voice.channel) {
				const { channel } = message.member.voice;
				const connection = await Voice.create(channel);

				subscription = new Subscription(connection);
				subscriptions.set(message.guildId, subscription);
			}
		}

		const track = new Track({
			creator: 'Nintendogs',
			title: `banger_${++i}.flac`,
			url: 'https://granbohm.dev/misc/banger_3.flac',
			onStart: (t: Track) =>
				Messaging.send(message, {
					embeds: [
						new Embed(this)
							.setTitle('Now playing 🎶')
							.setDescription(t.getInfo()),
					],
				}),
		});

		const queue = subscription.addToQueue(track);
		if (queue.length > 0)
			return {
				embeds: [
					new Embed(this)
						.setTitle('Added to queue 📃')
						.setDescription(track.getInfo()),
				],
			};
	}
}

export default Play;
