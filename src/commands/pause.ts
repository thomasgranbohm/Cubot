import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes";
import { Categories } from "../config";
import { Bot } from "../index";
import { checkBotVoice, checkUserVoice, getServerQueue } from "../utils";

export class Pause extends Command {

	constructor(client: Bot) {
		super(client, {
			description: "Pauses the playing track.",
			aliases: ["resume"],
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		let guildId = checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId);
		const queue = getServerQueue(this.client, guildId);

		const newState = !player?.paused;

		player?.pause(newState);

		return new MessageEmbed()
			.setTitle(`${newState ? "Paused" : "Resumed"} ${queue[0].title}`)
	}

}