import { Command } from "../classes";
import { Bot } from "../index";
import { Message, MessageEmbed } from "discord.js";
import { Categories } from "../config";
import { checkUserVoice, checkBotVoice } from "../utils";
import { NoTrackPlayingError, VolumeNotBetweenThresholdError } from "../errors";
import { UPPER_VOLUME_LIMIT } from "../constants";

export class Volume extends Command {

	constructor(client: Bot) {
		super(client, {
			aliases: ["vol"],
			description: "Change the volume of the playing track.",
			group: Categories.VOICE,
			guildOnly: true
		})
	}

	async run(message: Message, args?: string[]): Promise<string | MessageEmbed | null> {
		await checkUserVoice(message);
		let guildId = await checkBotVoice(this.client, message);

		const player = this.client.manager.players.get(guildId)
		if (!player) throw new NoTrackPlayingError();

		const currentVolume = player.state.volume;

		let embed = new MessageEmbed();
		if (args && args.length > 0) {
			const newVolume = parseInt(args[0]);

			if (newVolume === NaN || newVolume > UPPER_VOLUME_LIMIT || newVolume < 0)
				throw new VolumeNotBetweenThresholdError()

			player.volume(newVolume)
			embed
				.setTitle('Changed volume')
				.setDescription(`From ${currentVolume} to ${newVolume}!`);
		} else {
			embed.setTitle('Current volume').setDescription(`${currentVolume}%`);
		}

		return embed;
	}

}