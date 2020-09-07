import { MessageEmbed } from "discord.js";
import { Player } from "@lavacord/discord.js";
import getThumbnail from "./getThumbnail";
import { Bot } from "src";
import nowPlayingEmbed from "./nowPlayingEmbed";
import getServerQueue from "./getServerQueue";
import setServerQueue from "./setServerQueue";

export default async function queueLoop(client: Bot, guildId: string, player: Player): Promise<MessageEmbed | null> {
	let queue = getServerQueue(client, guildId);
	console.warn("Queue", queue.map((t, i) => (`${i + 1} ${t.title}`)))

	let track = queue.shift();
	if (!track) return null;

	if (track.uri.includes("youtube") && typeof track.thumbnail !== "string")
		track.thumbnail = await getThumbnail(client, track);

	player.play(track.track);

	player.once('end', async (data) => {
		if (data.reason === "REPLACED") return console.warn("Track was replaced...");
		queue = setServerQueue(client, guildId, getServerQueue(client, guildId).slice(1));
		console.warn("Ended. Queue length:", queue.length, data.reason)
		// TODO Loop
		if (queue.length > 0) queueLoop(client, guildId, player);
	});

	return nowPlayingEmbed(track)
}