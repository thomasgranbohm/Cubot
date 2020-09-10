import { Command } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../config";
import { checkUserVoice, checkBotVoice } from "../utils";
import { NotPlayingError } from "../errors";

export class Loop extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["l"],
			description: "Make the bot loop the current track.",
			group: Categories.VOICE
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		await checkUserVoice(message);
		const guildId = await checkBotVoice(this.client, message);

		const server = this.client.servers.get(guildId);
		if (!server) throw new NotPlayingError();

		let newSetting = true;
		if (server.loop)
			newSetting = !server.loop;


		this.client.servers.set(guildId, { ...server, loop: newSetting });

		// TODO loop entire queue :repeat: 
		// or single item :repeat_one: 

		return new MessageEmbed()
			.setTitle(`${newSetting ? "Looping :repeat_one:" : "Not looping :play_pause:"} `);
	}

}