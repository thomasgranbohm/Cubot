import { MessageEmbed } from "discord.js";
import { TrackEmbed } from "../classes";
import { NotPlayingError } from "../errors";
import { TrackObject } from "../types";
import getUserAvatar from "./getUserAvatar";

export default async function (currentTrack: TrackObject, nextTrack?: TrackObject): Promise<MessageEmbed> {
	if (!currentTrack) throw new NotPlayingError();

	let { author, requester, title, uri } = currentTrack;

	let embed = await new TrackEmbed(currentTrack)
		.setTitle("Now playing :musical_note:")
		.setDescription(`**[${title}](${uri})** by **${author}**`)
		.setFooter(
			`Track requested by ${requester.username}`,
			getUserAvatar(requester)
		)
		.getThumbnail();

	if (nextTrack) {
		embed.addField("Next up:", `[${nextTrack.title}](${nextTrack.uri})`);
	}

	return embed
}