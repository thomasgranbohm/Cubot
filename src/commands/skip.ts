import { Command } from "../classes/command";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../types";
import checkUserVoice from "../utils/checkUserVoice";
import checkBotVoice from "../utils/checkBotVoice";
import { NoTrackPlayingError as NotPlayingError } from "../errors";
import getServerQueue from "../utils/getServerQueue";
import nowPlayingEmbed from "../utils/nowPlayingEmbed";

export class Skip extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["s"],
			description: "Skips the playing track.",
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		await checkUserVoice(message);
		let guildId = await checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId);
		if (!player) throw new NotPlayingError();

		let queue = getServerQueue(this.client, guildId);
		let nextTrack = queue.slice(1).shift()
		await player.stop();

		if (nextTrack) return nowPlayingEmbed(nextTrack)
		return null;
	}

}