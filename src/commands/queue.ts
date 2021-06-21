import { Message, MessageEmbed } from 'discord.js';
import { MainCommand, TrackEmbed } from '../classes';
import { Categories } from '../config';
import { NotPlayingError } from '../errors';
import { Bot } from '../index';
import { TrackObject } from '../types';
import {
	checkBotVoice,
	checkUserVoice,
	getServerQueue,
	getUserAvatar,
} from '../utils';

export class Queue extends MainCommand {
	constructor(client: Bot) {
		super(client, {
			aliases: ['q'],
			description: 'Lists the tracks queued on this server.',
			category: Categories.VOICE,
			guildOnly: true,
		});
	}

	async run(
		message: Message,
		args?: string[]
	): Promise<string | MessageEmbed> {
		let guildId = await checkBotVoice(this.client, message);
		await checkUserVoice(message);

		let queue = getServerQueue(this.client, guildId);

		if (queue.length === 0) throw new NotPlayingError();

		let currentlyPlaying = queue.shift();
		let tracks = queue.map(({ title, uri, author }: TrackObject) => ({
			title,
			uri,
			author,
		}));

		if (!currentlyPlaying) throw new NotPlayingError();

		let { author, requester, title, uri } = currentlyPlaying;

		let embed = await new TrackEmbed(currentlyPlaying)
			.setTitle(`Queue for ${message.guild?.name}`)
			.addField(
				`Currently playing`,
				`[**${title}**](${uri}) by **${author}**`
			)
			.setFooter(
				`Track requested by ${requester.username}`,
				getUserAvatar(requester)
			)
			.getThumbnail();

		if (queue.length > 0) {
			let strings = tracks
				.slice(0, 5)
				.map(
					({ title, uri }, i) =>
						`**\`${i + 1}.\`** [${
							title.length > 48
								? title.substr(0, 48) + '...'
								: title
						}](${uri})`
				);
			if (queue.length > 5) {
				strings.push(`\nPlus ${queue.length - 5} more...`);
			}
			embed.addField(`Queue:`, strings.join('\n'));
		}
		return embed;
	}
}
