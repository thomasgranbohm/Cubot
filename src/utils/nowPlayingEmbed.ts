import { TrackObject } from "../types";
import { MessageEmbed } from "discord.js";
import { NotPlayingError } from "../errors";
import getUserAvatar from "./getUserAvatar";
import { TrackEmbed } from "../classes";

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