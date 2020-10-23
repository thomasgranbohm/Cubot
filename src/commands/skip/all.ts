import { Message, MessageEmbed } from "discord.js";
import { MainCommand, SubCommand } from "../../classes";
import { NotPlayingError } from "../../errors";
import { Bot } from "../../index";
import { checkBotVoice, checkUserVoice, setServerQueue } from "../../utils";

export class All extends SubCommand {

	constructor(client: Bot, parentCommand: MainCommand) {
		super(client, parentCommand, {
			aliases: ["a"],
			description: "Skips the whole queue."
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed> {
		await checkUserVoice(message);
		const guildId = await checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId);
		if (!player) throw new NotPlayingError();

		setServerQueue(this.client, guildId, []);
		await player.stop();

		return new MessageEmbed()
			.setTitle("So long, queue 👋");
	}

} 