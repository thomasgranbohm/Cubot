import { Message, MessageEmbed } from "discord.js";
import { Command } from "../classes";
import { Categories } from "../config";
import * as eqs from "../equalizers";
import { NoEqualizerFoundError } from "../errors";
import { Bot } from "../index";
import { checkBotVoice, checkUserVoice } from "../utils";
import changeEqualizer from "../utils/changeEqualizer";

export class Equalizers extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["eq", "equalizer", "eqs"],
			description: "Lists all equalizers or sets the current equalizer",
			group: Categories.VOICE,
			guildOnly: true,
			examples: ["<name>"]
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		if (!args || args?.length === 0) {
			let embed = new MessageEmbed()
				.setTitle('List of all equalizers')
				.setDescription(
					Object.entries(eqs)
						.map(([name, e]) => `**${name}** – ${e.description}`)
				)

			let { guild } = message;
			if (guild) {
				let server = this.client.servers.get(guild.id);
				if (server) {
					embed.setDescription([
						embed.description,
						`**Current:** ${server?.equalizer?.name || eqs.flat.name}`
					].join("\n\n"))
				}
			}

			return embed;
		}

		checkUserVoice(message);
		let guildId = checkBotVoice(this.client, message);

		const eqName = args.shift()?.toLowerCase();
		const foundEqualizer = Object.entries(eqs).find(([name, e]) => {
			if (name === eqName) return e;
			return undefined;
		});

		if (!foundEqualizer) throw new NoEqualizerFoundError();

		let embed = changeEqualizer(this.client, guildId, foundEqualizer[1]);
		return embed;
	}

}