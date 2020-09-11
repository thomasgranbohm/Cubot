import { Player } from "@lavacord/discord.js";
import { Bot } from "src"
import { getServerQueue, setServerQueue } from ".";

export default async function queueLoop(client: Bot, guildId: string, player: Player) {
	let queue = getServerQueue(client, guildId);

	let track = queue.shift();
	if (!track) return;

	player.play(track.track);

	player.once('end', async (data) => {
		if (data.reason === "REPLACED") console.warn("Track was replaced...");
		let server = client.servers.get(guildId);
		queue = getServerQueue(client, guildId);
		if (server && !server.loop)
			queue = setServerQueue(client, guildId, queue.slice(1));
		if (queue.length > 0) queueLoop(client, guildId, player);
	});
}