import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes";
import { Categories } from "../config";
import { NotPlayingError } from "../errors";
import { Bot } from "../index";
import { checkBotVoice, checkUserVoice, getServerQueue, nowPlayingEmbed } from "../utils";

export class Skip extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["s"],
			description: "Skips the playing track.",
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		let guildId = await checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId);
		if (!player) throw new NotPlayingError();

		let queue = getServerQueue(this.client, guildId);
		let nextTrack = queue.slice(1).shift()
		await player.stop();

		if (nextTrack) return nowPlayingEmbed(nextTrack)
		return new MessageEmbed()
			.setTitle("And now, silence.");
	}

}