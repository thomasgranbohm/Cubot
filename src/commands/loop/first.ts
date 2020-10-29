import { Message, MessageEmbed } from "discord.js";
import { MainCommand, SubCommand } from "../../classes";
import { NotPlayingError } from "../../errors";
import { Bot } from "../../index";
import { ServerObject } from "../../types";
import { checkBotVoice, checkUserVoice, getLoopEmbed } from "../../utils";

export class First extends SubCommand {

	constructor(client: Bot, parentCommand: MainCommand) {
		super(client, parentCommand, {
			aliases: ["f", "1"],
			description: "Loop only the first track.",
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		const guildId = await checkBotVoice(this.client, message);

		const server = this.client.servers.get(guildId);
		if (!server) throw new NotPlayingError();

		const newServerObject: ServerObject = {
			...server,
			loop: server.loop === "first"
				? "none"
				: "first"
		};
		this.client.servers.set(guildId, newServerObject);

		return getLoopEmbed(newServerObject.loop);
	}

}