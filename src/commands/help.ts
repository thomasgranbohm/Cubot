import { Message, MessageEmbed } from "discord.js";
import { MainCommand } from "../classes";
import { Categories } from "../config";
import { Bot } from "../index";
import { getGuildFromMessage } from "../utils/";

export class Help extends MainCommand {

	constructor(client: Bot) {
		super(client, {
			aliases: ["h"],
			description: "Gets help",
			group: Categories.MISC,
			examples: ["<command>"]
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		let guild = getGuildFromMessage(message)
		const prefix = await this.client.guildResolver.prefix(guild.id);

		const wantedCommand = args?.shift();
		if (!!wantedCommand) {
			const command = this.client.commands.find((c) => c.names.includes(wantedCommand));
			if (command instanceof MainCommand) {
				const wantedSubCommand = args?.shift();
				if (!!wantedSubCommand && !!command.subCommands && !!command.subCommands.get(wantedSubCommand)) {
					return command.help(prefix, true, wantedSubCommand)
				} else {
					return command.help(prefix, true)
				}
			}
		}

		return new MessageEmbed()
			.setTitle('List of all commands:')
			.setDescription(
				[
					this.client.commands
						.sort((a, b) => {
							let aName = a.names.slice().shift(),
								bName = b.names.slice().shift();
							if ((!aName || !bName)) return 0;

							if (aName > bName) return 1;
							else if (aName < bName) return -1;
							return 0;
						})
						.map((command) => command instanceof MainCommand && command.help(prefix))
						.join("\n"),
					`**Prefix in this guild:** \`${prefix}\``
				].join("\n\n")
			);
	}
}