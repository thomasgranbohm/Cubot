import { Message } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Command from '../classes/Command';
import Embed from '../classes/Embed';
import Subscription from '../classes/Subscription';
import Track from '../classes/Track';
import { Categories, YOUTUBE_REGEX } from '../constants';
import { NotYoutubeLinkError, UserNotInVoiceChannelError } from '../errors';
import Messaging from '../namespaces/Messaging';
import Voice from '../namespaces/Voice';
import { MessageReturnType } from '../types';

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

	async run(
		message: Message,
		args: string[]
	): Promise<MessageReturnType | null> {
		let subscription = subscriptions.get(message.guildId);

		if (!subscription) {
			if (message.member.voice.channel) {
				const { channel } = message.member.voice;
				const connection = await Voice.create(channel);

				subscription = new Subscription(connection);
				subscriptions.set(message.guildId, subscription);
			} else throw UserNotInVoiceChannelError;
		}

		const url = args.join(' ');
		if (!YOUTUBE_REGEX.test(url)) throw NotYoutubeLinkError;

		const track = await Track.create(url, {
			requester: message.author,
			onStart: () => {
				return Messaging.send(message, {
					embeds: [
						new Embed(this).setTitle('Now playing 🎶'),
						// .setDescription(t.getInfo())
						// .setThumbnail(t.thumbnail)
						// .setFooter(
						// 	`Track requested by ${t.requester.username}`,
						// 	t.requester.avatarURL({
						// 		dynamic: true,
						// 		format: 'webp',
						// 		size: 64,
						// 	})
						// ),
					],
				});
			},
		});

		const queue = subscription.addToQueue(track);
		if (queue.length > 0)
			return {
				embeds: [
					new Embed(this)
						.setTitle('Added to queue 📃')
						.setDescription(track.getInfo())
						.setThumbnail(track.thumbnail)
						.setFooter(
							`Track requested by ${track.requester.username}`,
							track.requester.avatarURL({
								dynamic: true,
								format: 'webp',
								size: 64,
							})
						),
				],
			};
	}
}

export default Play;
