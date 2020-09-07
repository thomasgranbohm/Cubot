import { Command } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../config";
import { TrackEmbed } from "../classes";
import { NoTrackPlayingError } from "../errors";
import { checkBotVoice, checkUserVoice, getServerQueue, getUserAvatar } from "../utils";
import { TrackObject } from "../types";

export class Queue extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["q"],
			description: "Lists the tracks queued on this server.",
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {


		let guildId = await checkBotVoice(this.client, message);
		await checkUserVoice(message);

		let queue = getServerQueue(this.client, guildId);

		if (queue.length === 0) throw new NoTrackPlayingError();

		let currentlyPlaying = queue.shift();
		let tracks = queue.map(({ title, uri, author }: TrackObject) => ({ title, uri, author }))

		if (!currentlyPlaying) throw new NoTrackPlayingError();

		let { author, requester, title, uri } = currentlyPlaying;

		let embed = new TrackEmbed(currentlyPlaying)
			.setTitle(`Queue for ${message.guild?.name}`)
			.addField(
				`Currently playing`,
				`[**${title}**](${uri}) by ${author}`
			)
			.setFooter(
				`Track requested by ${requester.username}`,
				getUserAvatar(requester),
			);

		if (queue.length > 0) {
			let strings = tracks.slice(0, 5).map(t => `**\`${tracks.indexOf(t) + 1}.\`** [${t.title}](${t.uri})`);
			if (queue.length > 5) {
				strings.push(`\nPlus ${queue.length - 5} more...`);
			}
			embed.addField(
				`Queue:`,
				strings.join("\n")
			);
		}
		return embed;
	}

}