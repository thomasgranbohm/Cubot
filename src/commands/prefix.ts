import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes";
import { Categories } from "../config";
import { ArgumentError } from "../errors";
import { Bot } from "../index";

export class Prefix extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["pr"],
			description: "Get or set the prefix in the guild.",
			group: Categories.MISC,
			needsArgs: true,
			examples: [`<new prefix>`]
		})
	}

	async run(message: Message, args: string[]): Promise<string | MessageEmbed | null> {
		let { guild } = message;
		if (!guild) return null;

		const resolver = this.client.guildResolver;

		let newPrefix = args.shift();

		if (!newPrefix) throw new ArgumentError(this);
		await resolver.setPrefix(guild.id, newPrefix);
		return new MessageEmbed()
			.setTitle(`New prefix is now: \`${newPrefix}\``);
	}

}