import { Bot } from "src";
import { BotNotInVoiceError, NoTrackPlayingError, NoGuildFoundError } from "../errors";
import getServerQueue from "./getServerQueue";
import { Message } from "discord.js";

export default function (client: Bot, message: Message): string {
	const guildId = message.guild?.id;
	if (!guildId) throw new NoGuildFoundError();

	if (!client.manager.players.get(guildId))
		throw new BotNotInVoiceError();

	let queue = getServerQueue(client, guildId);
	if (!queue || queue.length == 0)
		throw new NoTrackPlayingError();

	return guildId;
}