import { Command } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../config";

export class Now extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["np"],
			description: "Check what is playing.",
			group: Categories.VOICE
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		return "aaaa"
	}

}