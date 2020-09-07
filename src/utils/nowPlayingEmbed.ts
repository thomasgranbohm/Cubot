import { TrackObject } from "../types";
import { MessageEmbed } from "discord.js";
import { NoTrackPlayingError } from "../errors";
import getUserAvatar from "./getUserAvatar";
import { TrackEmbed } from "../classes";

export default function (currentTrack: TrackObject): MessageEmbed {
	if (!currentTrack) throw new NoTrackPlayingError();

	let { author, requester, title, uri } = currentTrack;

	let embed = new TrackEmbed(currentTrack)
		.setTitle("Now playing")
		.setDescription(`**[${title}](${uri})** by ${author}\n`)
		.setFooter(
			`Track requested by ${requester.username}`,
			getUserAvatar(requester)
		);

	return embed

}