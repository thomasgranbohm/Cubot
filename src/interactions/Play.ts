import { GuildMember, Interaction, User } from 'discord.js';
import { subscriptions } from '../classes/Bot';
import Embed from '../classes/Embed';
import CustomInteraction from '../classes/Interaction';
import Subscription from '../classes/Subscription';
import Track from '../classes/Track';
import { UserNotInVoiceChannelError } from '../errors';
import Voice from '../namespaces/Voice';
import { NowPlayingRow } from '../interactions/Now';

class PlayInteraction extends CustomInteraction {
	constructor() {
		super({
			name: 'play',
			description: 'Plays the given query or link in your voice channel.',
			options: [
				{
					name: 'song',
					type: 'STRING',
					description: 'The link or name of the track to play.',
					required: true,
				},
			],
		});
	}

	async run(interaction: Interaction) {
		if (!interaction.isCommand() || !interaction.inGuild()) return;
		let subscription = subscriptions.get(interaction.guildId);
		if (!subscription) {
			const member = interaction.member as GuildMember;
			if (member.voice.channel) {
				const { channel } = member.voice;
				const connection = await Voice.create(channel);

				subscription = new Subscription(connection);
				subscriptions.set(interaction.guildId, subscription);
			} else throw UserNotInVoiceChannelError;
		}

		const url = interaction.options.get('song')!.value! as string;

		const track = await Track.create(url, {
			requester: interaction.member.user as User,
			onStart: (t: Track) => {
				const toReply = {
					embeds: [
						new Embed()
							.setTitle('Now playing 🎶')
							.setDescription(t.getInfo())
							.setThumbnail(t.thumbnail)
							.setFooter(
								`Track requested by ${t.requester.username}`,
								t.requester.avatarURL({
									dynamic: true,
									format: 'webp',
									size: 64,
								})
							),
					],
					components: [NowPlayingRow()],
				};
				return interaction
					.reply(toReply)
					.catch(() => interaction.editReply(toReply));
			},
		});

		const queue = subscription.addToQueue(track);
		if (queue.length > 0)
			interaction.reply({
				embeds: [
					new Embed()
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
			});
		else {
			interaction.reply({
				embeds: [
					new Embed()
						.setTitle('Now playing 🎶')
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
				components: [NowPlayingRow()],
			});
		}
	}
}

export default PlayInteraction;
