import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes/command";
import { Bot } from "../index";
import { Categories } from "../types";

export class Owner extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["o"],
			description: "Only  an owner can use",
			group: Categories.MISC,
			ownerOnly: true
		})
	}

	async run(message: Message, args?: string[] | undefined): Promise<string | MessageEmbed> {
		return "You are the owner"
	}

}