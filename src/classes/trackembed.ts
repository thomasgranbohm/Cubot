import { MessageEmbed } from "discord.js";
import { TrackObject } from "../types";

export class TrackEmbed extends MessageEmbed {
	constructor(track: TrackObject) {
		super();
		let { thumbnail } = track;


		if (thumbnail) {
			this
				.attachFiles([
					{ attachment: thumbnail, name: `thumbnail.jpg` },
				])
				.setThumbnail(`attachment://thumbnail.jpg`);
		}
	}
}