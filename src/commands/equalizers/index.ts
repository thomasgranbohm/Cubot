import { Message, MessageEmbed } from "discord.js";
import { MainCommand } from "../../classes";
import { Categories } from "../../config";
import * as eqs from "../../equalizers";
import { NoEqualizerFoundError } from "../../errors";
import { Bot } from "../../index";
import { checkBotVoice, checkUserVoice } from "../../utils";
import changeEqualizer from "../../utils/changeEqualizer";
import * as subCommands from "./subcommands";

export class Equalizers extends MainCommand {

	constructor(client: Bot) {
		super(client, {
			aliases: ["eq", "equalizer", "eqs"],
			description: "Lists all equalizers or sets the current equalizer",
			group: Categories.VOICE,
			guildOnly: true,
			examples: ["<name>"],
			subCommands
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		console.warn("eqs")
		if (!args || args?.length === 0) {
			args = ["list"];
		}

		if (args && this.subCommands.size !== 0) {
			console.log(args)
			const success = await this.handleSubCommand(message, args);
			if (!!success)
				return success;
		}


		const eqName = args.shift()?.toLowerCase();
		const foundEqualizer = Object.entries(eqs)
			.find(([name, e]) => {
				if (name === eqName) return e;
				return undefined;
			});

		if (!foundEqualizer) throw new NoEqualizerFoundError();

		checkUserVoice(message);
		const guildId = checkBotVoice(this.client, message);

		const embed = await changeEqualizer(this.client, guildId, foundEqualizer[1]);
		return embed;
	}

}