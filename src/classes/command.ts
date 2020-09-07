import { Message, MessageEmbed } from "discord.js";
import { CommandOptions } from "../types";
import { Bot } from "../index";

export abstract class Command {
	names: string[];
	description: string;
	group: string;
	examples: string[];
	ownerOnly: boolean;
	guildOnly: boolean;
	needsArgs: boolean;

	protected client: Bot;

	// TODO Släng in alla commando options
	// TODO Fixa filstrukturen
	constructor(client: Bot, options: CommandOptions) {
		this.client = client;

		this.names = [this.constructor.name.toLowerCase()].concat(options.aliases || []);
		this.description = options.description;
		this.group = options.group;
		this.examples = options.examples || [];
		this.guildOnly = options.guildOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.needsArgs = options.needsArgs || false;
	}

	abstract async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null>

	help(extended: boolean = false): string | MessageEmbed {
		if (extended) {
			let embed = new MessageEmbed()
				.setTitle(`Detailed information about ${this.names.slice().shift()}`)
				.addField('**Description**', this.description);

			if (this.names.length > 1)
				embed.addField("**Aliases**", `\`${this.names.slice(1).join(", ")}\``, true)

			if (this.examples.length > 0)
				embed.addField(
					"**Usage**",
					`\`${this.client.prefix}${this.names.slice().shift()} ${this.examples.slice().pop()}\``,
					true
				)

			while (embed.fields.length % 3 !== 0) embed.addField("\u200B", "\u200B", true)
			if (this.needsArgs)
				embed.setDescription(
					(embed.description || "").concat("\nThis command need arguments.")
				)
			if (this.guildOnly)
				embed.setDescription(
					(embed.description || "").concat("\nThis command can only be used in guilds.")
				)
			if (this.ownerOnly)
				embed.setDescription(
					(embed.description || "").concat("\nThis command is owner only.")
				)

			return embed;
		}

		return `**${this.names.slice().shift()}** - ${this.description}`;
	}

	usage(): string {
		let string = this.client.prefix + this.names.slice().shift();
		if (this.needsArgs && this.examples.length > 0)
			string += ` ${this.examples.pop()}`;
		return string;
	}
}