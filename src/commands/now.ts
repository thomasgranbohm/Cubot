import { Command } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../config";
import { checkUserVoice, checkBotVoice, getServerQueue, nowPlayingEmbed } from "../utils";

export class Now extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["np"],
			description: "Check what is playing.",
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		checkUserVoice(message);
		const guildId = checkBotVoice(this.client, message);

		const [currentTrack, nextTrack] = getServerQueue(this.client, guildId);
		if (currentTrack) {
			return nowPlayingEmbed(currentTrack, nextTrack);
		}
		return null;
	}

}