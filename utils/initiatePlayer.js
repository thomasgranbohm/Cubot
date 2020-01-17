exports.util = {
	run(client, guildID) {
		if (!client.servers[guildID]) client.servers[guildID] = { queue: [], boost: false };
	}
}