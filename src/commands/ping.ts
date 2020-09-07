import { MessageEmbed } from "discord.js";
import { Command } from "../classes/command";
import { Bot } from "../index";
import { Categories } from "../types";

export class Ping extends Command {
	constructor(client: Bot) {
		super(client, {
			aliases: ["p"],
			group: Categories.MISC,
			description: "Pings",
		})
	}
	async run(): Promise<string | MessageEmbed> {
		this.client;
		return "Pong!";
	}
}