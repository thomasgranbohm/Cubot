import { Command, TrackEmbed } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed, User } from "discord.js";
import { Categories } from "../config";
import { NoResultsFoundError as NoResultsError, NoGuildFoundError, UnexpectedError, NotPlayingError } from "../errors";
import { checkUserVoice, initiatePlayer, getServerQueue, getTracks, setServerQueue, getIdealHost, queueLoop, getThumbnail, nowPlayingEmbed } from "../utils";
import { TrackObject } from "../types";
import { PLAYLIST_AMOUNT } from "../constants";

let setTrackInfo = async (track: TrackObject, author: User): Promise<TrackObject> => {
	track.title = track.title.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');

	track.requester = author;
	if (!track.thumbnail) {
		let path = await getThumbnail(track);
		if (!!path) track.thumbnail = path;
	}
	return track;
}

export class Play extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["p", "add"],
			description: "Plays the given query or link in your voice channel.",
			group: Categories.VOICE,
			guildOnly: true,
			needsArgs: true,
			examples: ["<query>", "<link>"]
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
			let toPush = await Promise.all(tracks.map(t => setTrackInfo(t, message.author)).slice(0, PLAYLIST_AMOUNT))
			queue.push(...toPush);
		} else {
			let track = tracks.shift();
			if (track) {
				let trackObject = await setTrackInfo(track, message.author)
				queue.push(trackObject)
			}
		}

		setServerQueue(this.client, guildId, queue);

		if (isFirst) {
			const player = await this.client.manager.join({
				guild: guildId,
				channel: voiceId,
				node: await getIdealHost(this.client.manager)
			});

			// TODO implement now and removal when skipping

			await queueLoop(this.client, guildId, player);

			let firstTrack = getServerQueue(this.client, guildId).shift();
			if (!firstTrack) throw new NotPlayingError();

			let embed = await nowPlayingEmbed(firstTrack);

			if (playlist) {
				embed.setDescription((embed.description || "").concat(`\nAdded the first ${PLAYLIST_AMOUNT} tracks from playlist.`))
			}
			return embed;
		} else if (!playlist) {
			let addedTrack = queue.slice().pop();
			if (!addedTrack) throw new NoResultsError();

			addedTrack.thumbnail = await getThumbnail(addedTrack);

			let { author, title, uri } = addedTrack;

			return await new TrackEmbed(addedTrack)
				.setTitle(`Added to the queue :notepad_spiral:`)
				.setDescription(`**[${title}](${uri})** by **${author}**\nIt is **#${queue.length - 1}** in the queue`)
				.getThumbnail();
		} else if (playlist) {
			return new MessageEmbed().setTitle(`Added the first ${PLAYLIST_AMOUNT} tracks from playlist.`);
		}
		throw new UnexpectedError("Track wasn't first, not a playlist, or a playlist.");
	}
}