import { Command } from "../classes/command";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../types";

export class Guild extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ['g'],
			description: "Can only be used in guild",
			group: Categories.MISC,
			guildOnly: true,
			needsArgs: true,
			ownerOnly: true
		})
	}

	async run(message: Message, args?: string[] | undefined): Promise<string | MessageEmbed> {
		return "This can only be used in a guild";
	}

}