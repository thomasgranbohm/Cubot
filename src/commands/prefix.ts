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
			examples: [`set <new prefix>`]
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		let { guild } = message;
		if (!guild) return null;

		const resolver = this.client.guildResolver;
		let dbGuild = await resolver.guild(guild.id);

		if (args) {
			let newPrefix = args.shift();

			if (!newPrefix) throw new ArgumentError(this);
			await resolver.setPrefix(guild.id, newPrefix);
			return `**New prefix is now:** \`${newPrefix}\``;
		}
		return `**Prefix in this guild:** \`${dbGuild.prefix}\``;
	}

}