import { MessageEmbed } from "discord.js";
import { Player } from "@lavacord/discord.js";
import { Bot } from "src"
import { getServerQueue, setServerQueue, nowPlayingEmbed } from ".";

export default async function queueLoop(client: Bot, guildId: string, player: Player): Promise<MessageEmbed | null> {
	let queue = getServerQueue(client, guildId);

	let track = queue.shift();
	if (!track) return null;

	player.play(track.track);

	player.once('end', async (data) => {
		if (data.reason === "REPLACED") console.warn("Track was replaced...");
		queue = setServerQueue(client, guildId, getServerQueue(client, guildId).slice(1));
		// TODO Loop
		if (queue.length > 0) queueLoop(client, guildId, player);
	});

	return nowPlayingEmbed(track)
}