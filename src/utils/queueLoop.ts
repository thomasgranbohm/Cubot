import { Player } from "@lavacord/discord.js";
import { getServerQueue, setServerQueue } from ".";
import { Bot } from "../";

export default async function queueLoop(client: Bot, guildId: string, player: Player) {
	let queue = getServerQueue(client, guildId);

	const track = queue.shift();
	if (!track) return;

	player.play(track.track);

	player.once('end', async (data) => {
		if (data.reason === "REPLACED") console.warn("Track was replaced...");
		const server = client.servers.get(guildId);
		queue = getServerQueue(client, guildId);
		if (server && queue.length !== 0) {
			// TODO test
			if (server.loop === "all") {
				queue = setServerQueue(client, guildId, [...queue.slice(1), track]);
			} else if (server.loop === "none") {
				queue = setServerQueue(client, guildId, queue.slice(1))
			}
		}
		if (queue.length > 0) queueLoop(client, guildId, player);
	});
}