import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes/command";
import { Categories } from "../types";

export class Args extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["a"],
			description: "Needs args",
			group: Categories.MISC,
			needsArgs: true,
			examples: [`<args>`]
		})
	}

	async run(message: Message, args: string[]): Promise<string | MessageEmbed> {
		return args.join(", ");
	}

}