module.exports = initiatePlayer = async (client, guildID) => {
	if (!client.servers[guildID]) client.servers[guildID] = { queue: [], boost: false };
}