import { Message, MessageEmbed } from "discord.js";
import { Bot } from "src";
import { CommandOptions, TrackObject } from "./types";
import { getThumbnail } from "./utils";

export abstract class Command {
	names: string[];
	description: string;
	group: string;
	examples: string[];
	ownerOnly: boolean;
	guildOnly: boolean;
	needsArgs: boolean;

	protected client: Bot;

	constructor(client: Bot, options: CommandOptions) {
		this.client = client;

		this.names = [this.constructor.name.toLowerCase()].concat(options.aliases || []);
		this.description = options.description;
		this.group = options.group;
		this.examples = options.examples || [];
		this.guildOnly = options.guildOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.needsArgs = options.needsArgs || false;
		if (!this.needsArgs) {
		}
	}

	abstract async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null>

	help(extended: boolean = false): string | MessageEmbed {
		if (extended) {
			let embed = new MessageEmbed()
				.setTitle(`Detailed information about ${this.names.slice().shift()}`)
				.addField("Description", this.description)

			let caveats = [];
			if (this.needsArgs)
				caveats.push("need arguments");
			if (this.guildOnly)
				caveats.push("can only be used in guilds");
			if (this.ownerOnly)
				caveats.push("is owner only");
			caveats = caveats.map(c => (`**${c}**`));

			if (caveats.length > 0) {
				embed
					.addField("Caveats", "This command " + (caveats.length > 1 ? caveats.slice(0, caveats.length - 1).join(", ") + " and " : "") + caveats[caveats.length - 1] + ".");
			}
			if (this.examples.length > 0) {
				embed.addField(
					"Usage",
					this.getExamples().join("\n"),
					true
				)
			}
			if (this.names.length > 1) {
				embed.addField("Aliases", `\`${this.names.slice(1).join(", ")}\``, true)
			}
			return embed;
		}

		return `**${this.names.slice().shift()}** – ${this.description}`;
	}

	private getExamples(): Array<string> {
		let examples = this.examples
			.slice(0, 3)
			.map(example => `\`${this.client.prefix}${this.names.slice().shift()} ${example}\``);
		if (!this.needsArgs) {
			examples.unshift("`" + this.client.prefix + this.names.slice().shift() + "`")
		}
		return examples;
	}

	usage(): string {
		let string = this.client.prefix + this.names.slice().shift();
		if (this.needsArgs && this.examples.length > 0)
			string += ` ${this.examples.pop()}`;
		return string;
	}
}

export class TrackEmbed extends MessageEmbed {
	track: TrackObject;
	constructor(track: TrackObject) {
		super();
		this.track = track;
	}

	async getThumbnail(): Promise<TrackEmbed> {
		if (!this.track.thumbnail) {
			let path = await getThumbnail(this.track);
			this.track.thumbnail = path;
		}
		if (this.track.thumbnail)
			this
				.attachFiles([
					{ attachment: this.track.thumbnail, name: `thumbnail.jpg` },
				])
				.setThumbnail(`attachment://thumbnail.jpg`);
		return this;
	}
}
