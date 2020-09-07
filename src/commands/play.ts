import { Command } from "../classes/command";
import { Bot } from "../index";
import { Message, MessageEmbed, User } from "discord.js";
import { Categories, TrackObject } from "../types";
import checkUserVoice from "../utils/checkUserVoice";
import initiatePlayer from "../utils/initiatePlayer";
import getServerQueue from "../utils/getServerQueue";
import getTracks from "../utils/getTracks";
import { ResultError as NoResultsError, NoGuildFoundError } from "../errors";
import getIdealHost from "../utils/getIdealHost";
import queueLoop from "../utils/queueLoop";
import getThumbnail from "../utils/getThumbnail";
import { TrackEmbed } from "../classes/trackembed";
import setServerQueue from "../utils/setServerQueue";

let setTrackInfo = (track: TrackObject, author: User): TrackObject => {
	track.title = track.title.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');

	track.requester = author;

	return track;
}

export class Play extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["p", "add"],
			description: "Plays the args given.",
			group: Categories.VOICE,
			needsArgs: true,
			examples: ["<args>"]
		})
	}

	async run(message: Message, args: string[]): Promise<string | MessageEmbed | null> {
		let voiceId = checkUserVoice(message);

		const guildId = message.guild?.id;

		if (!guildId) throw new NoGuildFoundError();

		await initiatePlayer(this.client, guildId);

		let isFirst = false;
		let query = args.join(" ");
		let queue = getServerQueue(this.client, guildId);
		let playlist = query.includes('list');
		let tracks = await getTracks(query.startsWith('http') ? query : `ytsearch:${query}`);

		if (tracks.length === 0)
			throw new NoResultsError();

		if (queue.length === 0)
			isFirst = true;

		if (playlist) {
			queue.push(...tracks.map(t => setTrackInfo(t, message.author)));
		} else {
			let track = tracks.shift();
			if (track) queue.push(setTrackInfo(track, message.author))
		}

		setServerQueue(this.client, guildId, queue);

		if (isFirst) {
			const player = await this.client.manager.join({
				guild: guildId,
				channel: voiceId,
				node: await getIdealHost(this.client.manager)
			});

			// TODO implement now and removal when skipping
			// const server = this.client.servers.get(guildId);
			// let nowPlaying = nowPlayingEmbed(queue);
			// if (server) {
			// 	server.playing = {
			// 		track: queue[0],
			// 		message: nowPlaying
			// 	}
			// }

			// TODO Loop
			// player.loop = true;

			return await queueLoop(this.client, guildId, player);
		} else {
			if (!playlist) {
				let addedTrack = queue.slice().pop();
				if (!addedTrack) throw new NoResultsError();

				if (addedTrack.uri.includes("youtube") && typeof addedTrack.thumbnail !== "string")
					addedTrack.thumbnail = await getThumbnail(this.client, addedTrack);

				let { author, title } = addedTrack;

				let embed = new TrackEmbed(addedTrack)
					.setTitle('Added to queue')
					.setDescription(`**${title}** by ${author}\n\nThere ${(queue.length - 1) > 1 ? `are ${queue.length - 1} tracks` : `is ${queue.length - 1} track`} before it.`)

				return embed;
			} else {
				return "Added everything from the playlist to the queue."
			}
		}

	}

}